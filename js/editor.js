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
     */
    parse_element(whats_parsing) {
        let string = "";

        let char;
        while (this.has_next()) {
            let previous_char = this.previous_char();
            char = this.next_char();

            if ((char == "," || char == ")") && previous_char != "\\") {
                break;
            } else {
                string += char;
            }
        }

        let class_name;

        switch (whats_parsing) {
            case 0: class_name = "state"; break;
            case 1: class_name = "symbol"; break;
            case 2: class_name = "direction"; break;
        }

        string = span_builder(string, class_name);

        if (char == ",")
            string += span_builder(char, "separator");
        else if (char == ")")
            string += span_builder(char, "parenthesis");

        return string;
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
                    returned_string += span_builder("(", "parenthesis");
                    returned_string += this.parse_element(0);
                    returned_string += this.parse_element(1);
                    returned_string += this.parse_element(0);
                    returned_string += this.parse_element(1);
                    returned_string += this.parse_element(2);
                    break;

                case ")":
                    returned_string += span_builder(")", "parenthesis");
                    break;

                case "!":
                    returned_string += span_builder("!", "breakpoint");
                    break;

                case "\n":
                    returned_string += "<br>";

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
    return new Highlighter(code).parse();
}

const code = document.getElementById("code");
const testing = document.getElementById("code-text");

code.addEventListener("input", () => {
    testing.innerHTML = highlight(code.value);

    testing.scrollTop = code.scrollTop;
    testing.scrollLeft = code.scrollLeft;
});

code.addEventListener("scroll", () => {
    testing.scrollTop = code.scrollTop;
    testing.scrollLeft = code.scrollLeft;
});

// for when first loading the page
testing.innerHTML = highlight(code.value);