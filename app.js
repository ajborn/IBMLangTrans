#!/usr/bin/env node
var fs = require('fs');
var inquirer = require('inquirer');
var program = require('commander');
var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

const iamApiKey = '3S6Yshpwn6Xf2hMepnbyOsBd-a3K8CYjkQVTMb85_L2a'
var prompt = inquirer.createPromptModule();

program
  .version('0.2.0')

var question = [
  {
    type: 'input',
    name: 'getpath',
    message: 'Enter a text file path to translate: '
  },
  {
    type: 'input',
    name: 'lang',
    message: 'Enter a lanuage code for translation EX: en-fr, en-af: '
  }
]

var question2 = [{
  type: 'input',
  name: 'getword',
  message: 'Enter a word to translate: '
}]

program
  .command('translate')
  .alias('t')
  .description('Enter a single word to translate')
  .action(() => {
    prompt(question2).then((response) => {
      var languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        iam_apikey: iamApiKey
      });
      var parameters = {
        text: response.getword,
        model_id: response.lang
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
  .description('Enter a filepath to process translations')
  .action(() => {
    prompt(question).then((response) => {
      ReadFile(response.getpath, response.lang)
    })
  })

program
  .command('lanuages')
  .alias('l')
  .description('Get all language codes')
  .action(() => {
    var languageTranslator = new LanguageTranslatorV3({
      version: '2018-05-01',
      iam_apikey: iamApiKey
    });
    languageTranslator.listIdentifiableLanguages(
      {},
      function (err, response) {
        if (err)
          console.log(err)
        else
          console.log(JSON.stringify(response, null, 2));
      }
    );
  })

var ReadFile = function (filePath, lang) {
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      var wordsToTranslate = data.split('\r\n');
      var translated = [];
      var parameters = {
        text: wordsToTranslate,
        model_id: lang
      };
      languageTranslator.translate(
        parameters,
        function (error, response) {
          if (error) {
            console.log(error)
          } else {
            for (var i = 0; i < response.translations.length; i++) {
              translated.push(wordsToTranslate[i] + ":" + response.translations[i].translation);
            }
            fs.writeFile("C:\\Users\\Default\\Documents\\Translated.txt", translated.toString(), function (err) {
              if (err) {
                return console.log(err);
              }
              console.log("Translations saved to C:\Users\Default\Documents\Translated.txt.");
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
