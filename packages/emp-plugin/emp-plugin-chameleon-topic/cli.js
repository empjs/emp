const inquirer = require('inquirer')
module.exports = program => {
  program
    .command('topic')
    .description('初始化 emp 项目')
    .action(() => {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: '请输入项目名(如 yy): ',
            default: function () {
              return 'topic-emp-pro'
            },
          },
        ])
        .then(async answers => {
          const name = `topic_emp_${answers.name}`
          const templateList = require('../config/template.json')
          await require('../helpers/downloadRepo')(templateList['topic-emp-demo'], name, '')
          const fs = require('fs')
          const path = require('path')
          const filepath = path.resolve(`${name}/package.json`)
          let content = require(filepath)
          content.name = name
          fs.writeFileSync(`${name}/package.json`, JSON.stringify(content, null, 2), 'utf8', err => {})

          const projectFile = path.resolve(`${name}/project-config.js`)
          content = fs.readFileSync(projectFile, 'utf8')
          content = content.replace(/topic_emp_tpl/g, name)
          fs.writeFileSync(`${name}/project-config.js`, content, 'utf8', err => {})
        })
    })
}
