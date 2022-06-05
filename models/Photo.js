module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define(
    'Photo',
    {
      description: DataTypes.STRING,
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true }
  );
  Photo.associate = models => {
    Photo.belongsTo(models.Service, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
  };

  return Photo;
};
