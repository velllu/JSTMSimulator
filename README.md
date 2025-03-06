# Online Turing Machine
This is a fork of Pisa's university turing machine online simulator, here are the differences:
- **Syntax highlight**, I rolled out a custom syntax highlighter to improve readability
- **Max no draw speed**, I found that drawing was the main bottleneck, this mode disables drawing until it has finished elaborating, making this perfect for breakpoints and quick testing. It of course does not work when the program is endless
- **Complete CSS rewrite**, because the old CSS was following outdated practices and had hard-coded positions, it didn't allow to resize the text box and it couldn't work on mobile
- **Changed project structure**, I stripped the backend to make this hostable on GitHub pages
- **Breakpoints**: I implemented breakpoints, a way to make the simulator stop at a certain state, useful for debugging big programs, the syntax is like this:
    ```
    (0, -, 1, a, >)
    !(1, -, 0, b, >)
    ```
    Note the `!`, that means it's gonna stop at the specified state.
- **Saving**: The website uses the `localStorage` API to automatically save the code and the text input locally, without user intervention
- **Tick button**: A button that advances the turing machine by just one tick, useful to be used alongside breakpoints
