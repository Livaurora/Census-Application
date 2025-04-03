module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define(
		'User',
		{
			username: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true,
			},

			password: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);

	return User;
};