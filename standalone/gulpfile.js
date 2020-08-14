const os = require('os')
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const CopyDir = require('copy-dir')
const AdmZip = require('adm-zip')
const webpackConfig = require('./webpack.config')

const packageJson = JSON.parse(fs.readFileSync('./package.json'))

let versionApp = fs.readFileSync('../backend/VERSION').toString()
const MAX_BUFFER = 1073741824

delete packageJson.devDependencies
delete packageJson.husky
delete packageJson.scripts
function cmdExec (
  command,
  options = {
    env: process.env
  }
) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        error.message += `\n${stderr}`

        return reject(error)
      }
      resolve({ stdout, stderr })
    })
  })
}

function copyFiles (from, to, options = {}) {
  return new Promise((resolve, reject) => {
    CopyDir(from, to, options, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function deleteFolderRecursive (pathDir) {
  if (fs.existsSync(pathDir)) {
    if (fs.lstatSync(pathDir).isDirectory()) {
      fs.readdirSync(pathDir).forEach((file) => {
        const curPath = path.join(pathDir, file)

        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath)
        } else {
          // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(pathDir)

      return
    }
    fs.unlinkSync(pathDir)
  }
}
// eslint-disable-next-line no-unused-vars
let VERSION

cmdExec('git log -n 1 --pretty="format:%h от %ai"').then(
  ({ stdout }) => {
    VERSION = `${versionApp.trim()} (${stdout.trim()})`
  },
  () => {}
)

const isDev = process.env.NODE_ENV === 'development'

const tsProject = ts.createProject('./tsconfig.json', {
  removeComments: !isDev,
  sourceMap: !isDev
})

gulp.task('backend', () => {
  return gulp
    .src(path.join('src', 'backend', '**', '*.ts'))
    .pipe(tsProject())
    .pipe(gulp.dest('build'))
})

gulp.task('frontend', () => {
  return gulp
    .src(path.join('src', 'frontend', 'index.tsx'))
    .pipe(webpackStream(webpackConfig(), webpack))
    .pipe(gulp.dest(path.join('build', 'app')))
})

gulp.task('conf', async () => {
  fs.writeFileSync(path.join('build', 'package.json'), JSON.stringify(packageJson, null, 2), {
    encoding: 'utf-8'
  })
})

gulp.task('copy', async () => {
  fs.writeFileSync(path.join(__dirname, 'build', 'VERSION'), versionApp.trim(), {
    encoding: 'utf-8'
  })
  await copyFiles('config', path.join('build', 'config'))
  if (fs.existsSync('assets')) {
    await copyFiles('assets', path.join('build', 'assets'))
  }
})

gulp.task('create_os_package', async () => {
  const platform = os.platform()
  await Promise.all([
    cmdExec('git submodule update --init -f --remote', {
      cwd: path.resolve(__dirname, '..'),
      env: process.env
    }),
    cmdExec('npm install', {
      cwd: path.resolve(__dirname, 'build'),
      env: process.env
    })
  ])
  versionApp = fs.readFileSync('../backend/VERSION').toString()
  cmdExec('git log -n 1 --pretty="format:%h от %ai"').then(
    ({ stdout }) => {
      VERSION = `${versionApp.trim()} (${stdout.trim()})`
    },
    () => {}
  )
  fs.writeFileSync(path.join(__dirname, 'build', 'VERSION'), versionApp.trim(), {
    encoding: 'utf-8'
  })
  await Promise.all([
    cmdExec('yarn backend:install', {
      maxBuffer: MAX_BUFFER,
      env: process.env
    }),
    cmdExec('yarn frontend:install', {
      maxBuffer: MAX_BUFFER,
      env: process.env
    })
  ])
  const { stdout: commitFrontend } = await cmdExec('git log -1 --pretty=format:%h', {
    cwd: path.resolve(__dirname, '..', 'frontend'),
    env: process.env
  })
  const { stdout: dateCommitFrontend } = await cmdExec('git log -n 1 --pretty=format:%ai', {
    cwd: path.resolve(__dirname, '..', 'frontend'),
    env: process.env
  })
  const { stdout: minCommitBackend } = await cmdExec('git log -1 --pretty=format:%h', {
    cwd: path.resolve(__dirname, '..', 'backend'),
    env: process.env
  })
  const { stdout: fullCommitBackend } = await cmdExec('git log -1 --pretty=format:%H', {
    cwd: path.resolve(__dirname, '..', 'backend'),
    env: process.env
  })

  await Promise.all([
    cmdExec('yarn backend:build', {
      maxBuffer: MAX_BUFFER,
      env: {
        ...process.env,
        BABEL_ENV: 'production'
      }
    }),
    cmdExec('yarn frontend:build', {
      maxBuffer: MAX_BUFFER,
      env: {
        ...process.env,
        BABEL_ENV: 'production',
        REACT_APP_REQUEST: 'GATE',
        REACT_APP_COMMIT_ID: commitFrontend,
        REACT_APP_BRANCH_DATE_TIME: dateCommitFrontend,
        PUBLIC_URL: '/',
        REACT_APP_PUBLIC_URL: '/',
        REACT_APP_BASE_URL: '/gate-core',
        REACT_APP_SETTINGS: '/gate-core?action=sql&query=MTGetSysSettings&js=true',
        REACT_APP_WS_BASE_URL: '/core_notification',
        REACT_APP_MODULE_URL: '/core-module',
        REACT_APP_FILE_URL: '/core-assets'
      }
    })
  ])
  await cmdExec(
    'yarn install',
    {
      cwd: path.join(__dirname, '..', 'backend', 'bin'),
      maxBuffer: MAX_BUFFER,
      env: {
        ...process.env,
        BABEL_ENV: 'production',
        NODE_ENV: 'production'
      }
    }
  )
  let versionstr = fs
    .readFileSync(path.join(__dirname, '..', 'backend', 'dbms', 's_mt', 'version.sql'), { encoding: 'utf-8' })
    .toString()

  versionstr += '\n--changeset builder:update_url dbms:postgresql runOnChange:true\n'
  versionstr += "UPDATE s_mt.t_sys_setting SET cv_value='/core-module' WHERE ck_id='g_sys_module_url';\n"
  versionstr += "UPDATE s_mt.t_sys_setting SET cv_value='/gate-core' WHERE ck_id='g_sys_gate_url';\n"
  versionstr += "UPDATE s_mt.t_sys_setting SET cv_value='/core_notification' WHERE ck_id='g_sys_ws_gate_url';\n"
  versionstr += `\n--changeset builder:update_${minCommitBackend} dbms:postgresql runOnChange:true\n`
  versionstr += `update s_mt.t_sys_setting set cv_value='${fullCommitBackend}' where ck_id='core_db_commit';\n`
  versionstr += `update s_mt.t_sys_setting set cv_value='${versionApp}' where ck_id='core_db_major_version';\n`
  versionstr +=
        "update s_mt.t_sys_setting set cv_value=to_char(CURRENT_TIMESTAMP, 'dd.MM.YYYY HH24:mm:ss') where ck_id='core_db_deployment_date';\n"
  fs.writeFileSync(path.join(__dirname, '..', 'backend', 'dbms', 's_mt', 'version.sql'), versionstr, {
    encoding: 'utf-8'
  })
  const tar = await cmdExec("which tar").then(({stdout}) => stdout.toString().indexOf("/") === 0 ? stdout.toString() : false, () => false);
  if (platform === "win32" || !tar) {
  const coreZip = new AdmZip()
    coreZip.addLocalFolder(
      path.join(__dirname, '..', 'frontend', 'packages', '@essence', 'essence-constructor-website', 'build')
    )
    coreZip.writeZip(path.join(__dirname, 'build', `core_${commitFrontend}.zip`))
    const ungateZip = new AdmZip()

    ungateZip.addLocalFolder(path.join(__dirname, '..', 'backend', 'bin'))
    ungateZip.writeZip(path.join(__dirname, 'build', `ungate_${minCommitBackend}.zip`))
    const dbmsZip = new AdmZip()

    dbmsZip.addLocalFolder(path.join(__dirname, '..', 'backend', 'dbms'))
    dbmsZip.writeZip(path.join(__dirname, 'build', `dbms_core_${minCommitBackend}.zip`))
    const dbmsAuthZip = new AdmZip()

    dbmsAuthZip.addLocalFolder(path.join(__dirname, '..', 'backend', 'dbms_auth'))
    dbmsAuthZip.writeZip(path.join(__dirname, 'build', `dbms_auth_${minCommitBackend}.zip`))
  } else {
    await cmdExec(`tar -czf ${path.resolve(__dirname, 'build', `core_${commitFrontend}.tar.gz`)} *`, {
      env: process.env,
      cwd: path.resolve(__dirname, '..', 'frontend', 'packages', '@essence', 'essence-constructor-website', 'build')
    })
    await cmdExec(`tar -czf ${path.resolve(__dirname, 'build', `ungate_${commitFrontend}.tar.gz`)} *`, {
      env: process.env,
      cwd: path.resolve(__dirname, '..', 'backend', 'bin')
    })
    await cmdExec(`tar -czf ${path.resolve(__dirname, 'build', `dbms_core_${commitFrontend}.tar.gz`)} *`, {
      env: process.env,
      cwd: path.resolve(__dirname, '..', 'backend', 'dbms')
    })
    await cmdExec(`tar -czf ${path.resolve(__dirname, 'build', `dbms_auth_${commitFrontend}.tar.gz`)} *`, {
      env: process.env,
      cwd: path.resolve(__dirname, '..', 'backend', 'dbms_auth')
    })
  }
  await cmdExec(
    `npm run build:electron-packager -- ./build install_app --overwrite --platform=${platform} --app-version="${VERSION}" --arch=x64 --out=build_app`,
    {
      env: process.env,
      cwd: __dirname,
      maxBuffer: MAX_BUFFER
    }
  )

  if (platform === 'linux') {
    await Promise.all(
      fs.readdirSync(path.resolve(__dirname, 'build_app'))
        .filter((file) => fs.statSync(path.resolve(__dirname, 'build_app', file)).isDirectory())
        .map(async (file) => {
          fs.writeFileSync(
            path.resolve(__dirname, 'build_app', file, 'install_app_nogui')
            , fs
              .readFileSync(path.resolve(__dirname, 'assets', 'install_app_nogui'), { encoding: 'utf-8' }))
          await cmdExec(
            `chmod +x ${path.resolve(__dirname, 'build_app', file, 'install_app_nogui')}`,
            {
              env: process.env,
              cwd: __dirname,
              maxBuffer: MAX_BUFFER
            }
          )
          return cmdExec(`tar -czf ${path.resolve(__dirname, 'build_app', `${file}.tar.gz`)} *`, {
            env: process.env,
            cwd: path.resolve(__dirname, 'build_app', file)
          })
        }
        )
    )
  } if (platform === 'win32') {
    fs.readdirSync(path.resolve(__dirname, 'build_app'))
      .filter((file) => fs.statSync(path.resolve(__dirname, 'build_app', file)).isDirectory())
      .map((file) => {
        fs.writeFileSync(
          path.resolve(__dirname, 'build_app', file, 'install_app_nogui.bat')
          , fs
            .readFileSync(path.resolve(__dirname, 'assets', 'install_app_nogui.bat'), { encoding: 'utf-8' }))
      })
  } else {
    await Promise.all(fs.readdirSync(path.resolve(__dirname, 'build_app'))
      .filter((file) => fs.statSync(path.resolve(__dirname, 'build_app', file)).isDirectory())
      .map(async (file) => {
        fs.writeFileSync(
          path.resolve(__dirname, 'build_app', file, 'install_app_nogui')
          , fs
            .readFileSync(path.resolve(__dirname, 'assets', 'install_app_nogui'), { encoding: 'utf-8' }))
        await cmdExec(
          `chmod +x ${path.resolve(__dirname, 'build_app', file, 'install_app_nogui')}`,
          {
            env: process.env,
            cwd: __dirname,
            maxBuffer: MAX_BUFFER
          }
        )
      }))
  }
})

gulp.task('clean', async () => {
  deleteFolderRecursive('build')
  deleteFolderRecursive('build_app')
})

gulp.task('build', gulp.series('clean', 'backend', 'frontend', 'conf', 'copy'))
gulp.task('build_package', gulp.series('build', 'create_os_package'))
