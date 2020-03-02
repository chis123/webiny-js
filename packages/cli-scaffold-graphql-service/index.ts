const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const util = require("util");
const ncp = util.promisify(require("ncp").ncp);

module.exports = [
    {
        name: "scaffold-template-apollo-service",
        type: "scaffold-template",
        scaffold: {
            name: "GraphQL Apollo Service",
            description:
                "Creates an /api template for this service. Also fills it in serverless.yml",
            generate: async ({ serviceName }) => {
                try {
                    // First we update serverless.yml
                    const serverlessFilePath = path.join(process.cwd(), "api/serverless.yml");
                    const serverlessJson = yaml.safeLoad(fs.readFileSync(serverlessFilePath));
                    if (serverlessJson[serviceName])
                        throw new Error(
                            "This service already exists in serverless.yml! Please pick a different name for it."
                        );

                    serverlessJson[serviceName] = {
                        component: "@webiny/serverless-apollo-service",
                        inputs: {
                            description: `Apollo service '${serviceName}' scaffoled by the CLI.`,
                            region: "${vars.region}",
                            memory: "512",
                            debug: "${vars.debug}"
                        }
                    };
                    fs.writeFileSync(serverlessFilePath, yaml.safeDump(serverlessJson));

                    // Then we also copy the template folder
                    const sourceFolder = path.join(__dirname, "templateFiles");
                    const destFolder = path.join(process.cwd(), "api", serviceName);

                    if (fs.existsSync(destFolder))
                        throw new Error(
                            "This service already exists in the 'api' folder! Please pick a different name for it."
                        );
                    await fs.mkdirSync(destFolder);
                    await ncp(sourceFolder, destFolder);

                    console.log(`Successfully scaffolded service ${serviceName}!`);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
];