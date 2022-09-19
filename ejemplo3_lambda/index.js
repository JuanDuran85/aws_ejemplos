exports.handler = async (event) => {
    console.debug(event);
    let name = JSON.stringify(`Hello from Lambda, ${event.firstName} ${event.lastName}`);
    const response = {
        statusCode: 200,
        body: name
    };
    return response;
};