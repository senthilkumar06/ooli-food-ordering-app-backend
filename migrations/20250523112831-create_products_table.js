"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("food_kart_products", {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
            price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },
            category: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            images: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            is_archived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.addIndex("food_kart_products", ["name"], {
            name: "food_kart_products_name_idx",
        });

        await queryInterface.addIndex("food_kart_products", ["created_at"], {
            name: "food_kart_products_created_at_idx",
            order: [["created_at", "DESC"]],
        });
    },

    down: async queryInterface => {
        await queryInterface.dropTable("food_kart_products");
    },
};
