"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const admin = require("firebase-admin");
    const schedule = require("node-schedule");
    const moment = require("moment-timezone");

    var serviceAccount = {
      type: "service_account",
      project_id: "mobiarv",
      private_key_id: "c264209ecbda7589ca925b0d995cbb0179281570",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCK8MC0lTBKAsQ2\n1TKy+H0OX2Lt01BR3Y9rEpV/+7FbeaGivrSpd7thCd4733c72QUee5lDNql9AzMs\nWkOdfQ+ASeObglYaXiQ8NU17VejLYt3rxr5hKdUvu4KVSqfliEJGdO749MugbomC\nyWmlVJ7nzub9hjYv03D/mBYUFml+Gt/QhcTngNoJ8+989zjVCIeD6+UWFYtlhGPj\nJ8a1yTHL1t+8uWNi/qJ5B4stp/pmpgQTkMPJqUmfsT4i2nBEHZUnlXsdy89W6VFZ\ny7ROfTfnHQd45NtuTE8LEpm64PqEpTvNfwDBhB2Qf8noSlpgqPunZc8BrINufDo6\ndGVB0pPRAgMBAAECggEAA/8h4+/orYWqhD3vZpOG8WC6tUb0qAOHX8KZ7KOzpIMk\nAaJFCxznwHEAD1ksZ7B57mMKyRKrnxjLojUkfcVo/+fgNWBzPptCT+hj8VjKyKhF\njvCEGG0Tdfs0VJFgXAC75fqbcdYvfKQWrjLsqDX+GNfsRWhUwF0aLS1Vm+qlyoag\n2zkCvVy/op9xYIJFyQjPa3ViJtKTv0Qo85cCkRrWGqSXtUl0FGqb1QCGzna8262J\nFGiKDPuuw2kmZLY0afr6NIaqNyxb/iT8bTgdmTHxyWR7BiDFMpuc7xu8ypPqRgJO\nbzxD/nhmlP8QsIhxFQsZ1xUEO1q2e6k1VrcvqPcMIQKBgQC/lRlBj4RQmc8abYol\nedKfDwoWgQ0ZurS6JMBa+a2hSi511X4Aoc+xDBwB5bRNjckTtMD7mNLNbh0V4ozR\nlETtZaYdF/qbY9YGcRhaqAPJ4dP/pvgXvIACOKSrMcLGqAgWrdED8QFtzWAvRjrW\nZFQb0dg+P4YMW1ZPkRPhglAeWQKBgQC5qF+vcx/1JH6MgYVAt1Aw4/IK2Rqnazm8\nePL0IJaF3zH/DB/Ks8giNPIUnC9tazLi1/L1f6iwJV5ogH/Na9OmoB3YTqmBSQ91\nP/HGEIxxnmfG/B4mexMuMTza0yrOf+Ye9kHLSNF8q9Y/lygIrxsnX9YhA9aX4wzL\nU1LWsxQiOQKBgG2aKfHE3kiSRdZztmXMNP/ERdwsBkei9cPMRLOHRZsRalUFR2mr\nKLu8FsXLGQSJSfDZJtKJUoguJ7ueeTtpHKnHzmm0jy2Yxxe2Wd17Y3d6l6MZbbN+\npqkeqK478JdgCAiZdgtQNKYRqaZCAmUmzqt/uLub8d9d3Zn1gK8xsw45AoGBAKXT\nJePnyBuFRSLqbMKo+Q8yCfZ2g8AVnbQhs58pnEhmWpmbkqnSemdTMwYFmrb4kLLc\nfz2XkGwEdJaSb5RjQuAJE58oY23+e7gWLTTjgw3Yloi8l5F3TGJtyBULl6hpxHjT\nK2EO4U2hjfOuZyuae35nszI542o2ei8BdXQe71TBAoGBAI8VDm9cJix4qvsbHv9S\nD+hmkzFQMADqyMaSp1nG1ug6j/QP77jqm3Gl2jfGBUh8bs3AuiYSDKOqWau3zmQ9\nkHa7i7JHuufdXLWYat3LdIQ3pNHpocvOt/+/SVUmwhYZTTi98hG83/0m1kQAnc/n\nBS9CSTabdp37+G0FexXoSrmN\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-tfpt7@mobiarv.iam.gserviceaccount.com",
      client_id: "109469257614539174966",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tfpt7%40mobiarv.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const scheduleNotification = async () => {
      const findAllUser = await strapi.db
        .query("plugin::users-permissions.user")
        .findMany({});

      const nowUtc = moment().utc();
      const now = nowUtc.add(7, "hours").format("HH:mm:ss");

      for (const user of findAllUser) {
        const medicationTime = moment(user.medication_time, "HH:mm:ss.SSS")
          .set({
            second: 0,
            millisecond: 0,
          })
          .utc()
          .format("HH:mm:ss");

        if (now === medicationTime) {
          const message = {
            notification: {
              title: "Saatnya Minum Obat!",
              body: "Sudah Saatnya Minum Obat",
            },
            data: {
              type: "Saatnya Minum Obat!",
            },
            android: {
              notification: {
                sound: "default",
              },
            },
            token: user.fcm_token,
          };

          try {
            await admin.messaging().send(message);
            console.log(`Notification sent to user ${user.id} at ${now}`);

            // Schedule the next notification 1 minutes later
            schedule.scheduleJob(
              moment().add(1, "minutes").toDate(),
              async () => {
                try {
                  await admin.messaging().send(message);
                  console.log(
                    `Next notification sent to user ${user.id} at ${moment()
                      .add(1, "minutes")
                      .format("HH:mm:ss")}`
                  );
                } catch (error) {
                  console.log(error, "error send next message");
                }
              }
            );
          } catch (error) {
            console.log(error, "error send message");
          }
        }
      }
    };

    // Schedule the check to run every 10 seconds
    schedule.scheduleJob("* * * * * *", async () => {
      await scheduleNotification();
    });
  },
};
