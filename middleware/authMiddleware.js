const atob = require('atob');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = async function (req, res, next) {
	const auth = req.headers.authorization;
	if (!auth || !auth.startsWith('Basic ')) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const base64 = auth.split(' ')[1];
	const [username, password] = atob(base64).split(':');

	const user = await db.User.findOne({ where: { username } });
	if (!user) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}

	const match = await bcrypt.compare(password, user.password.toString());
	if (!match) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}

	next();
};