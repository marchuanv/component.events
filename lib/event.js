const { MessageBus, MessageBusSubscription, MessageBusMessageStatus } = require("component.messagebus");
const messageBusCollection = [];
function Event({ host, port, ishttp , name }) {
    this.name = name;
    this.messagebus = messageBusCollection.find(x => x.host === host && x.port === port);
    if (!this.messagebus){
        this.messagebus = new MessageBus({ host, port, ishttp });
        messageBusCollection.push(this.messagebus);
    }
    this.subscription = new MessageBusSubscription();
    this.subscription.channels.push(this.name);
}
Event.prototype.listen = function() {
    return new Promise((resolve) => {
        this.subscription.callbackValidate = async ({ name, type }) => {
           return name === this.name && type === "component.event";
        };
        this.subscription.callback = resolve;
        this.messagebus.subscribe(this.subscription);
    });
};
Event.prototype.broadcast = function() {
    const message = new MessageBusMessage({ status: MessageBusMessageStatus.None });
    message.defineProperty({ name: "channel", value: this.name });
    message.defineProperty({ name: "type", value: "component.event" });
    message.validate();
    await this.messagebus.publish(message);
};
module.exports = Event;