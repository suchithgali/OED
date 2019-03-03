/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { log, LogLevel } = require('./log');

const users = require('./routes/users');
const fileProcessing = require('./routes/fileProcessing');
const readings = require('./routes/readings');
const meters = require('./routes/meters');
const preferences = require('./routes/preferences');
const login = require('./routes/login');
const verification = require('./routes/verification');
const groups = require('./routes/groups');
const version = require('./routes/version');
const baseline = require('./routes/baseline');

const app = express();

app.use(favicon(path.join(__dirname, '..', 'client', 'favicon.ico')));

// If other logging is turned off, there's no reason to log HTTP requests either.
// TODO: Potentially modify the Morgan logger to use the log API, thus unifying all our logging.
if (log.level > LogLevel.SILENT) {
	app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use('/api/users', users);
app.use('/api/meters', meters);
app.use('/api/readings', readings);
app.use('/api/preferences', preferences);
app.use('/api/login', login);
app.use('/api/groups', groups);
app.use('/api/verification', verification);
app.use('/api/fileProcessing', fileProcessing);
app.use('/api/version', version);
app.use('/api/baselines', baseline);

app.get('\\/|login|admin|groups|createGroup|editGroup|graph', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

app.use((req, res) => {
	res.status(404).send('<h1>404 Not Found<h1/>');
});

module.exports = app;
