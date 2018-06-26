#!/usr/bin/env node
var program = require('commander');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');

const iamApiKey = '3S6Yshpwn6Xf2hMepnbyOsBd-a3K8CYjkQVTMb85_L2a'

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
  })


program.parse(process.argv);
