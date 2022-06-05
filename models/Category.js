module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      grooming: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      shop: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      hotel: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      hospital: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { underscored: true }
  );
  Category.associate = models => {
    Category.belongsTo(models.Service, {
      foreignKey: {
        name: 'serviceId',
        allowNull: false,
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });
  };

  return Category;
};
