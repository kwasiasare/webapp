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
                const { resource: createdItem } = await container.items.create(item);
                context.res = {
                    body: createdItem
                };
                break;

            case 'PUT':
                const updatedItem = req.body;
                const { resource: replacedItem } = await container.item(updatedItem.id, updatedItem.id).replace(updatedItem);
                context.res = {
                    body: replacedItem
                };
                break;

            case 'DELETE':
                const shiftId = req.params.shiftId;
                if (!shiftId) {
                    context.res = {
                        status: 400,
                        body: "Missing shiftId parameter"
                    };
                    return;
                }

                const partitionKey = req.body.shiftId;
                await container.item(shiftId, partitionKey).delete();  // Use shiftId as both ID and partition key
                context.res = {
                    body: `Item with shiftId ${shiftId} deleted successfully`
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