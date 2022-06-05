module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Thailand',
      },
    },
    { underscored: true }
  );
  Address.associate = models => {
    Address.belongsTo(models.Service, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
  };

  return Address;
};
