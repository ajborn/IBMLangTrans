#!/usr/bin/env node
var fs = require('fs');
var inquirer = require('inquirer');
var program = require('commander');
var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');

const iamApiKey = '3S6Yshpwn6Xf2hMepnbyOsBd-a3K8CYjkQVTMb85_L2a'
var prompt = inquirer.createPromptModule();

program
  .version('0.2.0')

var question = [{
  type: 'input',
  name: 'getpath',
  message: 'Enter a file path to translate'
}]

var question2 = [{
  type: 'input',
  name: 'getword',
  message: 'Enter a word to translate: '
}]

program
  .command('start')
  .alias('s')
  .description('Enter a file path to translate')
  .action(() => {
    prompt(question).then((response) => {
      console.log("response:", response)
    })
  })

program
  .command('translate')
  .alias('t')
  .description('Enter a file path to translate')
  .action(() => {
    prompt(question2).then((response) => {
      var languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        iam_apikey: iamApiKey
      });

      var parameters = {
        text: response.getword,
        model_id: 'en-fr'
      };

      languageTranslator.translate(
        parameters,
        function (error, response) {
          if (error) {
            console.log(error)
          } else {
            var r = JSON.stringify(response, null, 2);
            console.log(response.translations[0].translation);
          }
        }
      );

    })
  });

program
  .command('file')
  .alias('f')
  .description('path')
  .action(() => {
    prompt(question).then((response) => {
      ReadFile(response.getpath)
    })
  })

var ReadFile = function (filePath) {
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      var wordsToTranslate = data.split('\r\n');
      var translated = [];
        console.log("wordsToTranslate: ", wordsToTranslate);
        var parameters = {
          text: wordsToTranslate,
          model_id: 'en-fr'
        };
  
        languageTranslator.translate(
          parameters,
          function (error, response) {
            if (error) {
              console.log(error)
            } else {
              for(var i = 0;i < response.translations.length; i++){
                  translated.push(wordsToTranslate[i] + ":" + response.translations[i].translation);
              }
              fs.writeFile("C:\\Users\\Default\\Documents\\Translated.txt", translated.toString(), function(err) {
                if(err) {
                    return console.log(err);
                }
            
                console.log("The file was saved!");
            }); 
              console.log("translated: ", translated);
            }
          }
        );
      
    } else {
      console.log(err);
    }
  });
}
var languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  iam_apikey: iamApiKey
});
program.parse(process.argv);
