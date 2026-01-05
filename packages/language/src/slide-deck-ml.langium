grammar SlideDeckMl

entry Presentation:
    'Presentation' name=ID '{'
        slides+=Slide*
    '}';

Slide:
    'Slide' name=ID '{'
        'titre' '=' titre=STRING
        content+=CodeContainer
    '}';

CodeContainer:
    'codeContainer'
        'language' '=' language=ID
        code=CODE_BLOCK;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal CODE_BLOCK: /```(\\.|[^'\\]|'(?!''))*```/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
