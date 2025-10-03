import fs from "fs";
import readline from "readline";
import path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// Prompt the user for input
rl.question("Enter a name: ", (name) => {
  // createFile()
  //   createFoldersAndFiles(name);
  const namesJson = formatLocation(name);
  console.log(namesJson);
  createFoldersAndFiles(namesJson);
  rl.close();
});

function formatLocation(input) {
  // Remove leading and trailing whitespace and split the input into words
  const words = input.trim().split(/\s+/);

  // Create capitalName by capitalizing each word and joining them without spaces
  const capitalName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  // Create formattedName by making the first word lowercase and capitalizing subsequent words
  const formattedName = words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");

  // Return the JSON object with both formats
  return {
    capitalName: capitalName,
    formattedName: formattedName,
  };
}

function createFoldersAndFiles(namesJson) {
  const formattedName = namesJson.formattedName;
  const capitalName = namesJson.capitalName;

  const folderPath = "src/app/modules"; // Base folder path
  const modulePath = path.join(folderPath, formattedName); // Full module path

  // Ensure the base folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created base folder: ${folderPath}`);
  }

  // Ensure the module folder exists
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
    console.log(`Created module folder: ${modulePath}`);
  } else {
    console.log(`Module folder already exists: ${modulePath}`);
  }

  const fileNames = [
    `${formattedName}Controller`,
    `${formattedName}Router`,
    `${formattedName}Schema`,
    `${formattedName}Service`,
  ];

  fileNames.forEach((fileName) => {
    createFiles(
      modulePath, // Correct path
      `${fileName}.ts`,
      getContent(fileName, formattedName, capitalName)
    );
  });
}

function createFiles(folderPath, fileName, content) {
  const filePath = `${folderPath}/${fileName}`;

  // Check if the file already exists
  if (!fs.existsSync(filePath)) {
    // Create the file and write the content
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File ${filePath} already exists.`);
  }
}

function getContent(fileName, formattedName, capitalName) {
  if (fileName.includes("Router")) {
    return generateRouterContent(formattedName, capitalName);
  } else if (fileName.includes("Controller")) {
    return generateControllerContent(formattedName, capitalName);
  } else if (fileName.includes("Schema")) {
    return generateSchemaContent(formattedName, capitalName);
  }else if(fileName.includes("Service")){
    return generateServiceContent(formattedName, capitalName);
  }

  return "";
}

function generateRouterContent(formattedName, capitalName) {
  return `
    import { FastifyPlugin } from "@/core/server/plugins"
    import { ${capitalName}Controller } from "./${formattedName}Controller"

    export const ${capitalName}Router: FastifyPlugin = (app, _opts, next) => {
        app.post("/", ${capitalName}Controller.create${capitalName})
        app.get("/", ${capitalName}Controller.list${capitalName})
        app.put("/:id", ${capitalName}Controller.update${capitalName})
        app.delete("/:id", ${capitalName}Controller.delete${capitalName})

        next()
    }
    `;
}

function generateControllerContent(formattedName, capitalName) {
  return `
    import { RouteShorthandOptionsWithHandler } from "fastify"
    import { requestMeta } from "@/core/helpers"
    import { ${capitalName} } from "./${formattedName}Schema"
    import { ${capitalName}Service } from "./${formattedName}Service"
    import { ${capitalName}Schema } from "./${formattedName}Schema"
    import { validateToken } from "@/core/server/middleware"
    import { hasRole } from "@/core/server/middleware"
    import { UserRole } from "@prisma/client"

    export const ${capitalName}Controller: Record<
    string,
    RouteShorthandOptionsWithHandler
    > = {
    create${capitalName}: {
        preValidation: [
        validateToken,
        hasRole(UserRole.ADMIN),
        ],
        schema: {
        body: ${capitalName}Schema,
        },
        handler: async (req) => {
        const body = req.body as ${capitalName}
        return await ${capitalName}Service.create${capitalName}(body)
        },
    },
    list${capitalName}: {
        handler: async (req) => {
        const body = req.params
        return await ${capitalName}Service.list${capitalName}s(body)
        },
    },
    update${capitalName}: {
        preValidation: [
        validateToken,
        hasRole(UserRole.ADMIN),
        ],
        schema: {
        body: ${capitalName}Schema,
        },
        handler: async (req) => {
        const params = req.params as { id: number }
        const body = req.body as ${capitalName}
        console.log(body)
        const id = params.id
        return await ${capitalName}Service.update${capitalName}(id, body)
        },
    },
    delete${capitalName}: {
        preValidation: [
        validateToken,
        hasRole(UserRole.ADMIN),
        ],
        handler: async (req) => {
        const params = req.params as { id: number }
        const id = params.id
        return await ${capitalName}Service.delete${capitalName}(id)
        },
    },
    }
    `;
}

function generateSchemaContent(formattedName, capitalName) {
  return `
    import { authConfig } from "@/app/config"
    import { User } from "@prisma/client"
    import { FromSchema } from "json-schema-to-ts"

    export const ${capitalName}Schema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
    } as const

    export type ${capitalName} = FromSchema<typeof ${capitalName}Schema>
    `;
}

function generateServiceContent(formattedName, capitalName) {
  return `
    import { ${capitalName} } from "./${formattedName}Schema"
    import { db, Paginated } from "@/core/database"

    export const ${capitalName}Service = {
    async create${capitalName}(body: ${capitalName}) {
        try {
        const ${formattedName} = await db.remoteSite.create({
            data: {
            name: body.name,
            },
        })

        return ${formattedName}
        } catch (error) {
        console.log(error)
        throw new Error("Unable to create item")
        }
    },

    async list${capitalName}s(body: any) {
        try {
        const ${formattedName} = await db.remoteSite.findMany()
        return ${formattedName}
        } catch (error) {
        console.log(error)
        throw new Error("Unable to list items")
        }
    },

    async update${capitalName}(id: Number, body: ${capitalName}) {
        try {
        const ${formattedName} = await db.remoteSite.update({
            where: {
            id: Number(id),
            },
            data: {
            name: body.name,
            },
        })

        return ${formattedName}
        } catch (error) {
        console.log(error)
        throw new Error("Unable to Update item")
        }
    },
    async delete${capitalName}(id: Number) {
        try {
        const ${formattedName} = await db.remoteSite.delete({
            where: {
            id: Number(id),
            },
        })

        return {
            message: "Item Deleted Successfully"
        }
        } catch (error) {
        console.log(error)
        throw new Error("Unable to Delete item")
        }
    },
    }

    `;
}