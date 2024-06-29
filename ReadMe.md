# Online / Offline Bookmark Manager

This document mostly contains details about how the code is structured and not about the features of the extension. For an introduction to the features and working of extension, check "Introduction.txt" file - its the same as the one uploaded onto the extension page.

The project uses following technologies: React, Redux, Redux toolkit, TypeScript, JavaScript, Express and NodeJS.

Overall the architecture for managing events in a web application is always event-driven-architecture. But for managing the redux state, layered-architecuture is used it has following layers: Redux slices, service layer, cache layer, DAO.

Since everything is stored within the browsers, the caches are updated immediately and the updates are sent to the browser optimistically.

At top level, the project consists of following folders: -

1. **build**: output folder for extension build.
2. **config**: for webpack and custom path configs.
3. **persistent-storage**: The folder where the current state of application state is stored - used to mock the browser - this is analogous to how the browser stores things permanently. It just works with an express server.
4. **src**: the source folder that contains all the source code.

Rest of the top level files and folders are self explanatory.

## Running the application

You can run the application either by loading it into the browser or by starting the webpack server.

Firstly, the dependencies have to be installed. For that install node js and npm. Then open the project folder in terminal and run the command `npm install`.

#### **Method I**: Loading into the browser

To build the application and run in browser extension, simply run the command `npm run build`. Then load the output folder (build) in the `chrome://extensions` page. It will add the extension to browser.
(If you need help, google how to load unpacked extension in browser for testing.)

Now just open the extension using its icon.

#### **Method II** (easier): Starting webpack server.

Open a terminal and run the command `npm start`.

Now just go to `localhost:8080` and you will see some randomly generated bookmarks there.

## Structure of `src` (source) folder

Source folder consists of five sub-folders for TypeScript code and one for SCSS code. Let us call each of these five sub-folders as src-sub-folders.

#### Contents of different sub-folders of `src` folder: -

1. `components`: The react components. This folder does not have the main export file. It imports various utilities such as state-machines from `scripts` folder.
2. `constants`: Self-explanatory.
3. `types`: self-explanatory.
4. `scss`: self-explanatory.
5. `scripts`: It contains a lot of standalone scripts used throughout the project. It contains the following. This folder has classes for storing and managing internal data structures for bookmarks, code for managing drag / drop events, data / state related services / Caches / DAOs, state machines used to track state of a folder or bookmark, utilities for themes and other utilities. It also contains code for mocking a browser API interface (for extensions).
6. `state`: This folder contains code for redux store and various redux toolkit slices used. It uses services imported from `scripts` folder.

#### Structure of import statements

Each of the five src-sub-folders for TypeScript code has a custom folder path (or alias) to refer to their main export file. The main export file is just a TypeScript file that I created - it imports all the relevant things within the same src-sub-folder and just exports all of it again. This file has the same name as that of the sub-folder itself.

When importing code from one file to another, a relative path is used if both files (one importing and the one being imported) are in same src-sub-folder.

However, if code is imported in a file within one src-sub-folder from a file in another src-sub-folder, the custom path (or alias) has is used. Thus outside one src-sub-folder, only the things exported in the main source file can be imported.

#### SCSS

SCSS for the layout is applied using a few key classes globally in a stylesheet.

(The styles for the themes however are generated using TypeScript.)
