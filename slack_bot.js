const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const request = require('request');
const JSONbig = require('json-bigint');
const async = require('async');
const REST_PORT = (process.env.PORT || 5000);
require('dotenv').load();

//const APIAI_ACCESS_TOKEN = "";
//const APIAI_LANG = process.env.APIAI_LANG || 'en';
//const apiAiService = apiai(APIAI_ACCESS_TOKEN);
const BeepBoop = require('beepboop-botkit');

const beepboop = BeepBoop.start(controller, {
    debug: true
});


var Botkit = require('./lib/Botkit.js');
var Constants = require('./constants.js');
var os = require('os');
var db = require('node-localdb');
var users = db('./user.json')
var botChannels = db('./botChannels.json');
var email1 = "";

var sessionId = uuid.v1();
const controller = Botkit.slackbot();

/*var controller = Botkit.slackbot({
    debug: true,
    interactive_replies: true
});
*/

var bot = controller.spawn({
    token: SLACK_TOKEN
}).startRTM();
//var membersList = getMembersList();
// say hi when joining a channel
controller.on('bot_channel_join', (bot, message) => {
    bot.reply(message, 'I\'m here!')
});

/*controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function (bot, message) {
    user.findOne({ id: message.user, team_id: message.team }).then(function (u) {
    });
    botChannels.findOne({ id: message.user, team_id: message.team }).then(function (u) {
        if (u == undefined) {
            insertBotChannels(message);
        }

    });
    //sendNewMessage("U2T627R18", "T2T2K05NC");

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function (err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

});*/
controller.on(['direct_message', 'direct_mention'], (bot, message) => {
	console.log(message);
	
		bot.reply(message, "Ibragim I am here");
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function (bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function (err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function (err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function (err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function (response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function (response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function (response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function (response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, { 'key': 'nickname' }); // store the results in a field called nickname

                    convo.on('end', function (convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function (err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function (err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});


controller.hears(['(.*)', '(.*)'], 'direct_message,direct_mention,mention', function (bot, message) {
    /* bot.startConversation(message, function(err, convo) {
 
     convo.ask({
         attachments:[
             {
                 title: 'Do you want to proceed?',
                 callback_id: '123',
                 attachment_type: 'default',
                 actions: [
                     {
                         "name":"yes",
                         "text": "Yes",
                         "value": "yes",
                         "type": "button",
                     },
                     {
                         "name":"no",
                         "text": "No",
                         "value": "no",
                         "type": "button",
                     }
                 ]
             }
         ]
     },[
         {
             pattern: "yes",
             callback: function(reply, convo) {
                 convo.say('FABULOUS!');
                 convo.next();
                 // do something awesome here.
             }
         },
         {
             pattern: "no",
             callback: function(reply, convo) {
                 convo.say('Too bad');
                 convo.next();
             }
         },
         {
             default: true,
             callback: function(reply, convo) {
                 // do nothing
             }
         }
     ]);
 });*/
    var name = message.match[1];
    var id1 = "";
    console.log("arrive1");
    controller.storage.users.get(message.user, function (err, user) {
        if (!user) {
            user = {
                id1: message.user,
            };
        }
        bot.reply(message, "I am working");

        /*let apiaiRequest = apiAiService.textRequest(name,
            {
                sessionId: sessionId
            });

        apiaiRequest.on('response', (response) => {
            console.log("Arrive2");
                console.log(response.result);

            let responseText = response.result.fulfillment.speech;
            bot.reply(message, responseText);

          


        });
          apiaiRequest.on('error', (error) => console.error(error));
            apiaiRequest.end();*/
        /*  users.findOne({ id: message.user }).then(function (u) {
              let apiaiRequest = apiAiService.textRequest(name + "  " + u.email,
                  {
                      sessionId: sessionId
                  });
  
              apiaiRequest.on('response', (response) => {
                  let responseText = response.result.fulfillment.speech;
                  bot.reply(message, responseText);
  
  
  
              });
  
  
              apiaiRequest.on('error', (error) => console.error(error));
              apiaiRequest.end();
          });*
         /* console.log("the email is " + email1);
          var text12 = {
              "text": "Please confirm time off request from ",
              "attachments": [
                  {
                      "text": "Choose a game to play",
                      "fallback": "You are unable to choose a game",
                      "callback_id": "wopr_game",
                      "color": "#3AA3E3",
                      "attachment_type": "default",
                      "actions": [
                          {
                              "name": "confirm",
                              "text": "Confirm",
                              "type": "button",
                              "value": "confirm"
                          },
  
                          {
                              "name": "cancel",
                              "text": "Cancel",
                              "style": "danger",
                              "type": "button",
                              "value": "Cancel",
                              "confirm": {
                                  "title": "Are you sure?",
                                  "text": "Are u sure?",
                                  "ok_text": "Yes",
                                  "dismiss_text": "No"
                              }
                          }
                      ]
                  }
              ]
          }
          var stringfy = JSON.stringify(text12);
          var obj1 = JSON.parse(stringfy);
          bot.reply(message, obj1);*/

        controller.storage.users.save(user, function (err, id) {

        });
    });
});

/*function getMembersList() {

    request({
        url: Constants.SLACK_MEMBERS_LIST_URL,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var i = 0;
            while ((body.members[i] != null) && (body.members[i] != undefined)) {
                users.insert({ id: body.members[i]["id"], team_id: body.members[i]["team_id"], email: body.members[i]["profile"].email }).then(function (u) {
                });
                console.log(body.members[i]["profile"].email);
                i++;


            }
        }
    });
}*/
function insertBotChannels(message) {
    botChannels.insert({ id: message.user, team_id: message.team, channel: message.channel }).then(function (u) {
    });

}
function sendNewMessage(userId, teamId) {
    var channel = "";
    botChannels.findOne({ id: userId, team_id: teamId }).then(function (u) {
        channel = u.channel;
        var message1 = {
            'type': 'message',
            'channel': channel,
            user: userId,
            text: 'what is my name',
            ts: '1482920918.000057',
            team: teamId,
            event: 'direct_message'
        };
        bot.startConversation(message1, function (err, convo) {
            if (!err) {
                console.log("arrive ");
                convo.say('Please confirm time off request from ');

            }
        });
    });

}
