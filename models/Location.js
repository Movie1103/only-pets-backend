module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true }
  );
  Location.associate = models => {
    Location.belongsTo(models.Service, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
  };

  return Location;
};
