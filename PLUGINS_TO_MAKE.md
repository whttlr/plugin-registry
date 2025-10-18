since ui-library has been updated, can we replace any instance where we 
are using any of these:

/Users/tylerhenry/Desktop/whttlr/electron-app/src/components

in the existing views

with the new imports from ui-library:
/Users/tylerhenry/Desktop/whttlr/ui-library

---

can we update our claude.md to insist on using the ui-library for all elements in the ui when building views. and if a new component is needed, it should be added to the ui-library first.

--




since ui-library has been updated, can we replace any instance where we 
are using custom styles in these:

/Users/tylerhenry/Desktop/whttlr/plugin-registry/plugins

and update them with the new exports from ui-library:
/Users/tylerhenry/Desktop/whttlr/ui-library

in additonn lets make a few more example plugins that use the ui-library components.

1. lets also just make a coordinate display plugin that uses the ui-library components to display the coordinates of the machine in a simple view. using the machine settings from the database. -- can you write a documentation on how this is finally achieved to a readme.md file in the new plugin.

2. lets make a 'jog-control' plugin that uses the ui-library components to create a jog control interface for the machine. this should allow the user to jog the machine in all directions and set the speed of the jog.  this sends commands to the machine via the api. the commands should be available to refereence in the api documentation.  -- can you write a documentation on how this is finally achieved to a readme.md file in the new plugin. verify the the apis exist before proceeding.

3. We need to create an outline of how to do this, and save it to an .md file before proceeding, as it will be a large task across multiple repos. we need to implement a new component in the ui-library repo. for a code editor. we need to add that component to the storbook and write tests for it. once the component is complete, we will import it into the new plugin. the other elements should already be available. the design will be for: lets make a 'g-code' code editor plugin, that has syntax highlighting, that allows users to write or upload a g-code file, and then send it to the machine via the g-code execure ote gcode-efile execute apis.  The execute button is enabled if we are connected to a machine, also available in the api documentation. -- can you write a documentation on how this is finally achieved to a readme.md file in the new plugin. if you are not connected to a machine, you can click on a 'connect machine' button that will open the machine connection dialog. and list the available ports.

4. We need to create an outline of how to do this, and save it to an .md file before proceeding, as it will be a large task across multiple repos. the design will be for: this plugin will add feature to the header, (which we current do not support, but we should add the abilitty to do so as an option).  It show sa connection badge, that says connected or no connected, and a green or gray light depending. if you click on it it opens a 'machine settings' modal, that fetches the 'last connected machine', checks if the connection is still valid, and if it is, by default selects it again in the ui. it also lists the other availabe ports, available via our api. if you click on a port, it will attempt to connect to that port. showing a progress bar while it connects. you also have the option to disconnect from the current machine, and to 'save to default' a selected machine. make a document of how to acheieve this in a .md file before proceeding.  

---

can we update our claude.md to insist on using the ui-library for all elements in the ui when building views. and if a new component is needed, it should be added to the ui-library first.

--










I need to do a test to see how the configs and database work together. Can we have a test view that prints the values fo the configs.

--

can we verify that the electron-app does not directly connect to the database but uses the api instead. if it does connecte directly can we develop a plan to update the api to provide and api for exposing database values by type. Like usersettings, machine settings, etc. but just for fetching values from the databases and for posting updates to the database.

--

can we use the ui-library for the plugins in plugin-registry

--


