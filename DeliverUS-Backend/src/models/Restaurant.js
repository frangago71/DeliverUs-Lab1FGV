import { Model } from 'sequelize'
import moment from 'moment'

const loadModel = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Restaurant.belongsTo(models.RestaurantCategory, { foreignKey: 'restaurantCategoryId', as: 'restaurantCategory' })
      Restaurant.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Restaurant.hasMany(models.Product, { foreignKey: 'restaurantId', as: 'products' })
      Restaurant.hasMany(models.Order, { foreignKey: 'restaurantId', as: 'orders' })
    }

    async getAverageServiceTime () {
      try {
        const orders = await this.getOrders()
        const serviceTimes = orders.filter(o => o.deliveredAt).map(o => moment(o.deliveredAt).diff(moment(o.createdAt), 'minutes'))
        return serviceTimes.reduce((acc, serviceTime) => acc + serviceTime, 0) / serviceTimes.length
      } catch (err) {
        return err
      }
    }
  }
  Restaurant.init({
    // TODO: Include the rest of the properties of the Restaurant model
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    restaurantCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'RestaurantCategories',
        key: 'id'
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE', 
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    postalCode: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    url: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    shippingCosts: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    averageServiceMinutes: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    logo: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    heroImage: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    status: {
      allowNull: true,
      type: DataTypes.ENUM,
      values: [
        'online',
        'offline',
        'closed',
        'temporarily closed'
      ],
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }

  }, {
    sequelize,
    modelName: 'Restaurant'
  })
  return Restaurant
}

export default loadModel
