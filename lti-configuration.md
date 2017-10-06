# Configuring LTI2.0 Settings
  This document contains an explanation of the components of the LTI
  configuration files that the user of this template will need to edit as well
  as how to edit them.

## Where Files Can be Found
  There are two lti specific configuration files in the config folder in the
base directory: `lti-description` and `lti-resources`.
* `lti-description`: Contains the general information about this tool including
the name, description, version, and other information that will be established
when the tool is first created.
* `lti-resources`: Defines the resource links that the tool consumer can
display, defines the messages that Canvas should send back to the
tool provider, and asks Canvas for the capabilities necessary to function.

Contains all of the capabilities that this tool will need
from Canvas as well as the different types of messages it can receive and
how those messages should be handled.

## lti-description Explained
  A full description of each of these terms can be found
[here](https://www.imsglobal.org/lti/model/uml/purl.imsglobal.org/vocab/lti/v2/lti/)
  This file contains information that will be defined when this tool is first
  created and then not changed during development of the tool.
  * `tool_proxy_guid`: A generated unique identifier for this tool proxy
  * `tool_consumer_profile`: Consumer specific information that is received from
  the tool consumer (Canvas in our case).
  * `tool_profile`: Contains all of the information specific to this tool
  including the name, description, etc.
    * `product_instance`: Refers to the deployed instance of this product.
      * `product_info`: Describes the specific product instance.
        * `product_name`: The name of this tool.
          * `default_value`: The default name to display if there is no value
          with the given key within the given locale(?)
          * `key`: A unique identifier to look up the "locale-specific" value
          from a resource bundle(?)
        * `description`: Provides a description of the tool to a user
          * `default_value`: the default description of this tool if there is
          no locale-specific value associated with the given key
          * `key`: A unique identifier to look up the locale-specific value from
          a resource bundle
        * `product_version`: The version of this tool
        * `product_family`: Encapsulates information about *all* versions of
        this product.
          * `code`: A unique identifier for the product family
          * `vendor`: The owner of this product family
            * `code`: A unique identifier for the vendor
            * `vendor_name`: Name of the vendor of this product
              * `default_value`: The default name of the vendor if there is no
              value associated with the given key within the given locale.
              * `key`: A unique identifier to look up the locale-specific value
              from a resource bundle.
      * `base_url_choice`: Defines the base URL used within this tool
      profile. The base url is (explanation of how the selector works)
        * `default_base_url`: The url that should be used for all entities
        specified by the given selector.
        * `selector`: Specifies the objects within this tool profile to which
        the base url will apply (?)
* `enabled_capability`: Contains all of the capabilities that this tool
    will be requesting. There is a single capability that is enabled to
    establish the split secret between Canvas and this tool provider. (? can't
    find the documentation for this one but the tool can't register without
    it)
## lti-customized explained
  This file will be edited to specify the interaction between this tool and
  the tool consumer.
  * `tool_profile`: Contains all of the information specific to this tool
  including how it handles different LTI interactions.
    * `resource_handler`: (don't have a good plain english explanation for
      this yet).
      * `resource_type`: (?)
        * `code`: A unique identifier for this resource
      * `resource_name`: (unclear what the resource actually is supposed
        to be)
        * `default_value`:
        * `key`:
      * `message`: Defines how the launch request will be handled
        * `path`: Which route from the base url should handle the given
        message.
        * `enabled_capability`: Contains the Canvas specific capabilities that
        this tool will be requesting.
        * `parameter`: The information that this tool will be
        requesting from the LMS. This contains general LTI parameters
        whereas `enabled_capability` contains Canvas specific parameters (?).

## Editing lti-resources
 Fill in the basic profile information such as name and version numbers using
 the descriptions above.

 The most confusion when editing this file will likely be determining what
 capabilities and parameters your application wants or has access to. Location
 for
 determining [LTI general capabilities](https://www.imsglobal.org/lti/model/uml/purl.imsglobal.org/vocab/lti/v2/lti/index.html#Capability). And
[here](https://github.com/instructure/canvas-lms/blob/stable/lib%2Flti%2Fvariable_expander.rb#L83) is the location for more information
on Canvas specific capabilities (don't think this is documented).
