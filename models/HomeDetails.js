module.exports = (sequelize, Sequelize) => {
	const HomeDetails = sequelize.define(
		'HomeDetails',
		{
			country: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			city: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);

	HomeDetails.associate = function (models) {
		HomeDetails.belongsTo(models.Participant, {
			foreignKey: { name: 'participantId', allowNull: false },
			onDelete: 'CASCADE',
		});
	};

	return HomeDetails;
};
