---
layout: doc
---
QUICKSTART
==========
First of all, please clone this github repository: [https://github.com/eclipsesource/jsonforms-seed.git](https://github.com/eclipsesource/jsonforms-seed.git)

This repository contains a basic JSONForms project template to get you started. It contains an index.html as well as an app.js file containing the application logic. The index.html specifies all relevant dependencies as well as some boilerplate HTML. To retrieve all dependencies we’ll use NodeJS. If you don’t have 'npm' yet installed (or never heard of it) please [follow these instructions](https://docs.npmjs.com/getting-started/installing-node). Then, navigate to the cloned repository and execute the following command within your shell:

```npm start```

This will install all relevant dependencies and start a local webserver.

Now open the js/app.js file. You’ll see that the file already contains a predefined controller called MyController. The controller gets injected the SchemaService and the UISchemaService which provide the JSON Schema and the UI Schema respectively. In this example we’ll use a stripped-down version of the schema we outlined last time, where a user has only four properties: name, age, gender and birth date.
We also provide a ready-to-use UI Schema, which consists of three controls ordered in a horizontal fashion. Let’s change this layout to feature an additional control and layout the controls side-by-side. Below is given the complete code to do so.

{% highlight js %}
app.service('UISchemaService', function () {
    this.uiSchema = {
        "type": "HorizontalLayout",
        "elements": [
            {
                "type": "VerticalLayout",
                "elements": [
                    {
                        "type": "Control",
                        "label": "Name",
                        "scope": {
                            "$ref": "#/properties/name"
                        }
                    },
                    {
                        "type": "Control",
                        "label": "Age",
                        "scope": {
                            "$ref": "#/properties/age"
                        }
                    }
                ]
            },
            {
                "type": "VerticalLayout",
                "elements": [
                    {
                        "type": "Control",
                        "label": "Height",
                        "scope": {
                            "$ref": "#/properties/height"
                        }
                    },
                    {
                        "type": "Control",
                        "label": "Gender",
                        "scope": {
                            "$ref": "#/properties/gender"
                        }
                    }
                ]
            }
        ]
    };
});
{% endhighlight %}

Writing schemas by hand shouldn’t happen very often, since we will provide tooling for creating UI schemas, but it is beneficial to know that the UI schemas are just regular JSON.

As one might expect, the VerticalLayout layouts all its children vertically while the HorizontalLayout orders its children horizontally.

With the UI schema, all there is left to do is to wire things up. This happens via the usage of a custom directive provided by JSONForms. Open the index.html and replace the TODO comment with this line:

{% highlight html %}
<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>
{% endhighlight %}

![Generated form](http://eclipsesource.com/blogs/wp-content/uploads/2015/07/image03.png){:.img-responsive}

If we now want to rearrange the form, for example to align all elements vertically, we can do so by changing a single line in the UI schema. Change the type property of the top-level element from ```HorizontalLayout``` to ```VerticalLayout``` and you’ll see the form pictured beneath.

![Generated form with different layout](http://eclipsesource.com/blogs/wp-content/uploads/2015/07/image01.png){:.img-responsive}

This should give you a good impression of why one would like to use JSONForms: Changes to the UI are easy to be made and HTML templates don’t have to be touched. Also, once tooling support for creating UI schemas is available, writing complex forms will be a lot less time-consuming.

You are encouraged to play around with the UI schema and move elements around. We would be happy to receive any feedback.
