class Highlighter {
    constructor(code) {
        this.code = code;
        this.pointer = 0;

        this.currently_parsing = 0;
    }

    next_char() {
        let char = this.code[this.pointer];
        this.pointer += 1;
        return char;
    }

    this_char() {
        return this.code[this.pointer];
    }

    previous_char() {
        return this.code[this.pointer - 1];
    }

    has_next() {
        return this.pointer < this.code.length;
    }

    /**
     * @param whats_parsing 0 for state, 1 for symbol and 2 for direction
     * @returns an object, that has an "element" key containing the HTML tag that
     * represents the element, and a "completed" key, that tells it wether the state was
     * completed or if it stopped at half
     */
    parse_element(whats_parsing) {
        let string = "";
        let class_name;

        switch (whats_parsing) {
            case 0: class_name = "state"; break;
            case 1: class_name = "symbol"; break;
            case 2: class_name = "direction"; break;
        }

        let char;
        while (this.has_next()) {
            let previous_char = this.previous_char();
            char = this.next_char();

            // If we encounter a newline, it means that the user it means that the user
            // is still typing the state, so we go to the next line
            if (char == "\n") {
                return {
                    "element": span_builder(string, class_name) + "<br>",
                    "completed": false
                };
            }

            if ((char == "," || char == ")") && previous_char != "\\") {
                break;
            } else {
                string += char;
            }
        }

        string = span_builder(string, class_name);

        if (char == ",")
            string += span_builder(char, "separator");
        else if (char == ")")
            string += span_builder(char, "parenthesis");

        return { "element": string, "completed": true };
    }

    parse_comment() {
        let string = "";

        while (this.has_next()) {
            let char = this.next_char();

            if (char == "\n") {
                break;
            } else {
                string += char;
            }
        }

        return span_builder("#" + string, "comment");
    }

    parse_state() {
        let string = "";

        string += span_builder("(", "parenthesis");

        // A state is like this (STATE, CHARACTER, STATE, CHARACTER, DIRECTION), these
        // numbers represent that
        for (const i of [0, 1, 0, 1, 2]) {
            let element = this.parse_element(i);

            if (element.completed) {
                string += element.element;
            } else {
                string += element.element;
                return string;
            }
        }

        return string;
    }

    parse() {
        let returned_string = "";

        while (this.has_next()) {
            let char = this.next_char();

            switch (char) {
                case " ":
                    returned_string += "&#160"
                    break;

                case "#":
                    returned_string += this.parse_comment() + "<br>";
                    break;

                case "(":
                    returned_string += this.parse_state();
                    break;

                case ")":
                    returned_string += span_builder(")", "parenthesis");
                    break;

                case "!":
                    returned_string += span_builder("!", "breakpoint");
                    break;

                case "\n":
                    returned_string += "<br>";
                    break;

                default:
                    returned_string += span_builder(char, "invalid");
                    break;
            }
        }

        return returned_string;
    }
}

function span_builder(contents, class_) {
    return `<span class="editor-${class_}">${contents}</span>`;
}

function highlight(code) {
    return new Highlighter(code).parse() + "<br>";
}

const code = document.getElementById("code");
const syntax_highlighting = document.getElementById("code-text");

code.addEventListener("input", () => {
    syntax_highlighting.innerHTML = highlight(code.value);

    syntax_highlighting.scrollTop = code.scrollTop;
    syntax_highlighting.scrollLeft = code.scrollLeft;
});

code.addEventListener("scroll", () => {
    syntax_highlighting.scrollTop = code.scrollTop;
    syntax_highlighting.scrollLeft = code.scrollLeft;
});

// for when first loading the page
syntax_highlighting.innerHTML = highlight(code.value);