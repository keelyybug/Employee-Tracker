const {prompt} = require('inquirer');
const logo = require('asciiart-logo');
const db = require('./db');
require('console.table');

init();

function init(){
    const logoText = logo({name: 'Employee Manager'}).render();

    console.log(logoText);

    LoadMainPrompts();
}

function LoadMainPrompts(){
    prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices:[
                {
                    name:
                    value:
                },
                {
                    name:
                    value:
                },
                {
                    name:
                    value:
                },
                {
                    name:
                    value:
                },
                {
                    name:
                    value:
                },
            ]
        },
    ]);
}