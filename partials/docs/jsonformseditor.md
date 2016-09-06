---
layout: doc
---
Tooling - the JSON Forms Editor
===============================

To make using JSON Forms even simpler, JSON Forms provides an online editor for easily creating data schemata and UI schemata. Instead of writing those schemata manually in a text editor, the JSON Forms Editor allows you to define data schemata and UI schemata in a simple user interface and export the JSON representation of the schemata, ready to be used in a JSON Forms application. Of course, you can also import existing schemata from their JSON representation and modify them using the JSON Forms Editor. Thus, you can also use existing data schemata, import them into the editor, and only create a UI schema for an existing data schema.

We provide a running [online test instance of the JSON Forms editor](http://jsonforms-editor.eclipsesource.com). If you are interested in custom hosting, please contact us.

Overview
--------

When you open the editor, you can select where to get the data schema from.

- **Empty data schema**: Start with an empty data schema and use the JSON Forms Editor to create it on the fly.
- **Upload**: Upload an existing data and UI schema
- **GitHub**: Retrieve an existing data and UI schema from a GitHub repository
- **URL**: Retrieve an existing data schema from a URL

![Dialog for new data schema](images/docs/jsonformseditor.newschema.png){:.img-responsive .docimg}

Once you have selected a data schema to start with, you will see the main page of the JSON Forms Editor as shown in the following screenshot. If you have selected to start with an empty schema, there will be no properties in the “controls” section. Please see below for a detailed description of the areas in the JSON Forms user interface.

![Dialog for new data schema](images/docs/jsonformseditor.editoroverview.png){:.img-responsive .docimg}

Controls Toolbox (1)
---------------------

The Control Toolbox shows all properties of the underlying data schema as controls. If you start with an empty data schema, the toolbox initially is empty until you define properties (see next section). If you start with an existing data schema, the toolbox shows all of its properties. To add a certain property to the form, drag it into the UI schema area in the middle (area (3), see UI schema) and thereby add a reference to the UI schema. By setting "Hide used elements", the toolbox only shows elements in the toolbox, which have not yet been added to the UI schema.

If the data schema contains objects (nested structures), the toolbox shows those with a folder icon. Objects cannot directly be shown in the UI, but their properties can. To add such a nested property, first click on the object to navigate to its properties. You can then add its properties to the UI schema by dragging them into the area of the UI schema (3).

The layout toolbox on top of the control toolbox (1b) allows you to add layout elements (container) to the UI schema. Those elements enable you to structure the controls of a UI schema. Use drag and drop to add layout elements to the UI schema and controls or nested layouts into them.

Data Schema Editor (2)
-----------------------

The JSON Forms Editor is focused on creating and modifying UI schemata, but it also allows you to create and modify the underlying data schema. Therefore, you can delete existing properties from the schema (trash icon next to the control) and add new properties (area (2) below the toolbox).

To add new properties to the data schema, first select whether to create a string, number, boolean, or object. Then, enter a name for the property and click "Create". The new property will directly appear in the control toolbox.

For string, number, and boolean properties, you can additionally set "advanced" options (on top of the creation area). Here, you can define a property to be "required" or to be an “Enum”. Objects allow you to create nested structures, that is, objects containing objects. If you want to add a property to a “sub object”, first click on the object to navigate to its properties. Then, you can add properties in the control toolbox.

UI Schema (3)
--------------

The UI schema shows the content and structure of the form being created. It contains controls and layout elements. Both can be added via drag and drop from the toolboxes on the left (see areas (1) and (4)). The structure of the existing UI elements can also be adapted using drag and drop. To remove elements from the UI schema, use the trash icon. Please note that removing a control from the UI schema will just affect the UI, not the underlying data schema.

By selecting an element in the UI schema, you can modify its details in the property view to the right (3b). For example, this allows you to define a label, set elements to "read-only", or define visibility rules.

Preview (4)
------------

The UI schema shows a structural overview of the current form under design. If you want to see how the current form would be rendered by the default renderers, click "Preview". The preview shows a fully functional form. Thus, it behaves just like the form that you will embed into your application, including visibility rules and validation (see following screenshot). By using the "detach" action at the lower right-hand side area, you can create a dedicated preview window to be used in parallel to the editor (e.g. on a second screen).

![Preview of a UI Schema](images/docs/jsonformseditor.preview.png){:.img-responsive .docimg}

Export (5)
-----------

Once you are finished with defining the data and UI schema, you can export them and use them in your JSON Forms application. Therefore, the export wizard allows you to browse the underlying schemata, copy them, or download them as files.
