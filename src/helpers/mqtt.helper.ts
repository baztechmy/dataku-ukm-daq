import ch from "@harrypoggers25/color-utils";
import mqtt from "mqtt";

namespace Mqtt {
    export interface MqttClientConfig extends mqtt.IClientOptions {
        host: string
    };
    export interface MqttClientOptions {
        showMessage?: boolean;
    }

    export class MqttClient {
        private config: MqttClientConfig | null;
        private client: mqtt.MqttClient | null;
        private subscribedTopicHandlers: Record<string, (message: string) => Promise<void>>;
        private showMessage: boolean;
        private newTopics: Array<string>;

        constructor(config: MqttClientConfig, options?: MqttClientOptions) {
            options = {
                showMessage: options?.showMessage ?? true
            };

            this.config = null;
            this.client = null;
            this.subscribedTopicHandlers = {};
            this.showMessage = options.showMessage!;
            this.newTopics = [];

            this.connect(config);
        }

        public connect(config: MqttClientConfig) {
            this.config = config;
            this.client = (() => {
                try {
                    const client = mqtt.connect(config);
                    client.on('connect', () => {
                        console.log(ch.green('MQTT CONNECT:'), `Client connected to MQTT broker at ${this.config?.host}`);
                    });

                    client.on('error', (error: any) => {
                        console.log(ch.red('MQTT ERROR:'), error.message ?? error);
                    });

                    client.on('close', () => {
                        if (this.showMessage) console.log(ch.yellow('MQTT CLOSE:'), `Client closed connection from MQTT broker at ${this.config?.host}`);
                    });

                    client.on('offline', () => {
                        if (this.showMessage) console.log(ch.yellow('MQTT OFFLINE:'), `MQTT broker at ${this.config?.host} is offline`);
                    });

                    client.on('message', async (topic, message) => {
                        if (this.newTopics.some(newTopic => newTopic === topic)) {
                            const index = this.newTopics.indexOf(topic);
                            if (index !== -1) this.newTopics.splice(index, 1);

                            console.log(ch.green('MQTT SUBSCRIBE:'), `Client subscribed to MQTT topic ${topic}`);
                        }

                        if (this.showMessage) console.log(ch.yellow(`MQTT MESSAGE [${topic}]:`), `Client received message '${message.toString()}'`);
                        await this.subscribedTopicHandlers[topic](message.toString());
                    });

                    return client;
                } catch (error: any) {
                    console.log(ch.red('MQTT CONNECT ERROR:'), error.message ?? error);
                    return null;
                }
            })();
        }

        public disconnect() {
            if (!this.client) {
                console.log(ch.red('MQTT DISCONNECT ERROR:'), 'Client is not currently connected to an MQTT broker');
                return;
            }

            this.client.end(() => {
                console.log(ch.green('MQTT DISCONNECT:'), `Client disconnected from MQTT broker at ${this.config?.host}`);

                this.config = null;
                this.client = null;
                this.subscribedTopicHandlers = {};
            });
        }

        public subscribe(topic: string, handler: (message: string) => Promise<void>) {
            if (!this.client) {
                console.log(ch.red('MQTT SUBSCRIBE ERROR:'), 'Client is not currently connected to an MQTT broker');
                return;
            }
            if (Object.keys(this.subscribedTopicHandlers).includes(topic)) {
                console.log(ch.red('MQTT SUBSCRIBE ERROR:'), `Client is already subscribed to the MQTT topic '${topic}'`);
                return;
            }
            if (this.newTopics.some(oldTopic => oldTopic === topic)) {
                console.log(ch.red('MQTT TOPIC DUPLICATE:'), `Client is already connecting to the MQTT topic '${topic}'`);
                return;
            }

            this.newTopics.push(topic);
            this.subscribedTopicHandlers[topic] = handler;
            this.client.subscribe(topic, (error: any) => {
                if (error) {
                    console.log(ch.red('MQTT SUBSCRIBE ERROR:'), error.message ?? error);
                    delete this.subscribedTopicHandlers[topic];
                    return;
                }
            });
        }

        public publish(topic: string, message: string) {
            if (!this.client) {
                console.log(ch.red('MQTT PUBLISH ERROR:'), 'Client is not currently connected to an MQTT broker');
                return;
            }

            this.client.publish(topic, message, (error: any) => {
                if (error) {
                    console.log(ch.red('MQTT PUBLISH ERROR:'), error.message ?? error);
                    return;
                }

                console.log(ch.green('MQTT PUBLISH:'), `Client published message '${message}' to MQTT topic ${topic}`);
            });
        }
    }

    export function define(config: MqttClientConfig): MqttClient {
        return new MqttClient(config);
    }
}

export default Mqtt;
