// File: index.js
const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const cosmosClient = new CosmosClient({
        endpoint: process.env['CosmosDBEndpoint'],
        key: process.env['CosmosDBKey']
    });

    const databaseId = 'ShiftDatabase';
    const containerId = 'Shifts';

    const { method } = req;

    try {
        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);

        switch (method) {
            case 'GET':
                const { resources } = await container.items.readAll().fetchAll();
                context.res = {
                    body: resources
                };
                break;

            case 'POST':
                const item = req.body;
                // Generate ShiftId, dateReceived, and timeReceived if they are not provided
                if (!item.ShiftId) {
                    const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
                    const uniquePart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                    item.ShiftId = `${datePart}-${uniquePart}`;
                }
                if (!item.dateReceived) {
                    item.dateReceived = new Date().toISOString().split('T')[0];
                }
                if (!item.timeReceived) {
                    item.timeReceived = new Date().toTimeString().split(' ')[0];
                }

                const { resource: createdItem } = await container.items.create(item);
                context.res = {
                    body: createdItem
                };
                break;

            case 'PUT':
                const updatedItem = req.body;
                if (!updatedItem.ShiftId) {
                    context.res = {
                        status: 400,
                        body: "ShiftId is required for updating"
                    };
                    return;
                }

                // Explicitly set the partition key (ShiftId) for the update operation
                const { resource: replacedItem } = await container
                    .item(updatedItem.ShiftId, updatedItem.ShiftId)
                    .replace(updatedItem);
                context.res = {
                    body: replacedItem
                };
                break;

            case 'DELETE':
                const ShiftId = req.params.ShiftId;
                if (!ShiftId) {
                    context.res = {
                        status: 400,
                        body: "Missing ShiftId parameter"
                    };
                    return;
                }

                // Use ShiftId as both ID and partition key for deletion
                await container.item(ShiftId, ShiftId).delete();
                context.res = {
                    body: `Item with ShiftId ${ShiftId} deleted successfully`
                };
                break;

            default:
                context.res = {
                    status: 405,
                    body: "Method Not Allowed"
                };
        }
    } catch (error) {
        context.log.error('Error processing request:', error);
        context.res = {
            status: 500,
            body: "An error occurred"
        };
    }
};
