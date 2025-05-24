"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("food_kart_discounts", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            target_type: {
                type: Sequelize.ENUM("your", "enum", "values"), // Replace with actual values
            },
            value_type: {
                type: Sequelize.ENUM("your", "enum", "values"), // Replace with actual values
            },
            discount_type: {
                type: Sequelize.ENUM("your", "enum", "values"), // Replace with actual values
            },
            value: Sequelize.DECIMAL(12, 2),
            is_deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        });

        await queryInterface.addConstraint("food_kart_discounts", {
            fields: ["code", "value_type"],
            type: "unique",
            name: "food_kart_discounts_unique",
        });
    },

    down: async queryInterface => {
        await queryInterface.dropTable("food_kart_discounts");
    },
};
