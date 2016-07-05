---
layout: doc
---
EMF FORMS INTEGRATION
=====================
Make sure to read both [EMF Forms](http://eclipsesource.com/blogs/tutorials/getting-started-with-EMF-Forms/) and [JSONForms](https://github.com/eclipsesource/jsonforms/wiki/Getting-Started) “Getting started” tutorials to understand the following topic and setup for both frameworks.

Both frameworks fulfill the same requirement based on two different technology stacks: Efficiently creating an User Interface based on a given Data Schema. In both frameworks, instead of manually coding the UI, it is described by an UI Schema. The name for this artefact is “UI Schema” in JSON Forms and “View Model” in EMF Forms. Both formats are compatible to each other, so it is possible to reuse it. Currently we offer an automatic transformation from a EMF Forms View Model to a JSON Forms UI Schema. Also we provide a transformation from an Ecore data model definition (used by EMF Forms) to a JSON Schema (used by JSON Forms). This allows to use the powerful Eclipse-based tooling for EMF Forms and EMF to create UI Schemas and JSON Schemas for JSON Forms.

To use the integration, you need set up the Eclipse development environment, first.

Preparations
------------

### Installing Eclipse ###

First, you need to download Eclipse and install the Integration Tooling. For this purpose, use the latest [Eclipse Neon Modeling Edition](https://www.eclipse.org/downloads/packages/eclipse-modeling-tools/neonr). Extract the archive and start Eclipse. When started, go to
```Help > Install New Software```

![Menu for installing new software](https://github.com/eclipsesource/jsonforms/wiki/images/install-new-software.png){:.img-responsive}

Add this [Update Site URL](http://download.eclipse.org/ecp/releases/releases_target_19) and make sure to select ‘Group items by category’. You should see the EMFForms2JSONForms category, which you can activate. If you do not have EMF Forms and EMF Client Platform in version 1.9.x installed, also select the feature ‘ECP SDK 3.x‘ in the category ‘All SDKs (install one of these)‘. Press _Next_. Accept the EPL and click _Finish_. If prompted with a warning, that unsigned content is installed, press _OK_ (Milestone builds are not signed). When the installation is finished, Eclipse will ask to restart. Please confirm to do so.

### Cloning the JSONForms seed project ###

The [JSONForms seed project](https://github.com/eclipsesource/jsonforms-seed) serves as a starting point for a JSONForms-based project. It includes everything you need to get started. Of course, you can also use your own JSON application.

In order to use the JSON Forms seed project, first clone the project: ```git clone https://github.com/eclipsesource/jsonforms-seed.git```

When finished, switch to the directory and execute ```npm start``` (if you don’t have npm installed, please [see here](https://docs.npmjs.com/getting-started/installing-node) for detailed instructions how to do so) and your are done. You can open the ```index.html``` to see a very basic rendered form in action. The schema and UI schema which this template is based on, can be found in the ```js/``` sub directoy of the project (```schema.js``` and ```ui-schema.js``` files respectively). Please see the [JSON Forms Getting Started](https://github.com/eclipsesource/jsonforms/wiki/Getting%20Started) for more information about the JSON Forms seed project.

How-to
------
You’ll now need a EMF Forms View Model which can be exported. We’ll use the EMF Forms ‘Make it happen’ example model here. To create the example project, go to

```New > Examples > EMF Forms > Make it happen: view model```

and follow the wizard. When finished, you’ll have three additional projects in your workspace. In the ```org.eclipse.emf.ecp.makeithappen.viewmodel``` project, open the context menu of your ```viewmodels/User.view``` model (right-click) and select

```EMF Forms > Export to JSONForms```

![JSONForms export entry](https://github.com/eclipsesource/jsonforms/wiki/images/emf2web-context-menu.png){:.img-responsive}

To understand what happens behind the scenes remember that each view has a “Root EClass”. The exporter generates a JSON Schema for that EClass as well as  a JSONForms UI Schema for the selected view.

The JSON Schema Generator traverses all EStructuralFeatures of the corresponding EClass and generates a property for each one of them. Since JSONSchema uses a simpler set of attributes (number, integer, string and boolean) the Ecore datatypes are mapped to these types. To simplify the generated schemas we chose to embed referenced EClasses into the JSON Schema directly. Since this leads to a problem with circular references, all references which are pointing back to the original EClass are removed.

The JSONForms UI Schema Generator traverses all elements of the given view generating each control with a reference to the corresponding datatype in the JSON Schema.

But enough of the theory, let’s continue the example. After you selected the Export to JSONForms action from above, an exporter wizard shows up.

![EMF Forms to JSONForms Wizard](https://github.com/eclipsesource/jsonforms/wiki/images/emf2web-wizard.png){:.img-responsive}

 1. The type of the generated model. The type is of the form EClass.name + Model/View
 2. The location where this generated schema will be saved to. By selecting _Browse_ you can choose a workspace or filesystem location. Please overwrite the ```schema.js``` and the ```ui-schema.js``` in the ```js``` subdirectory of the seed project respectively when prompted for a location where to put the schema/UI schema.
 3. By checking this option, the generated JSON data will be wrapped in JavaScript files according to the JSONForms seed project
 4. The generated JSON Schema. If you want to change or edit the generated file just edit the conent of this textbox.

For this example please check the optional “Wrap in JavaScript example” to wrap the generated schemas for the JSONForms seed project. For “UserModel” select the location of the “schema.js” file and for “UserView” select the location of the “ui-schema.js” of the JSONForms seed project.

Now let’s startup the JSONForms application and let’s look at the result. You can do so by navigating to the jsonforms-seed folder and open the ```index.html``` file.

![Rendered form](https://github.com/eclipsesource/jsonforms/wiki/images/emf2web-rendered-form.png){:.img-responsive}

You are encouraged to play around with the View model and re-export it as often as you want. If you have any questions or problems you can either [open an issue](https://github.com/eclipsesource/jsonforms/issues/new) or drop us a mail at [info@jsonforms.org](mailto:info@jsonforms.org).

Current limitations
-------------------
The current implementation of the JSONForms has some limitations which will be fixed soon. Currently these limitations are:

 * per type only a single reference is considered during the export, i.e. when there are multiple references with the same type only one will be considered during the export
 * certain layouts and widgets like Categorizations or custom controls are not yet supported
 * no support for rules yet

If you find anything that is missing or broken please do not hesitate to [open an issue](https://github.com/eclipsesource/jsonforms/issues/new).

