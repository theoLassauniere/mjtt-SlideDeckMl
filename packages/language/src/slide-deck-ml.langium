grammar SlideDeckMl

entry Presentation:
    'Presentation' name=ID '{'
        template=Template
        slides+=Slide*
    '}';

Template:
    'Template'
        ('logos' '=' '[' logos+=Logo (',' logos+=Logo)* ']')?
        ('companyName' '=' companyName=STRING)?
        ('fontName' '=' fontName=STRING)
        ('fontSize' '=' fontSize=STRING)
        ('fontColor' '=' fontColor=Color)
        ('backgroundColor' '=' backgroundColor=Color)?;

Logo:
    'logo'
        'path' '=' path=STRING
        ('positions' '=' '[' positions+=Position (',' positions+=Position)* ']')?;

Slide:
    'Slide' '{'
        ('title' '=' title=STRING)?
        ('backgroundColor' '=' backgroundColor=Color)?
        containers+=Container*
    '}';

Container:
    TextContainer | MediaContainer | CodeContainer
;

TextContainer:
    'text'
        'text' '=' text=STRING
        ('fontSize' '=' fontSize=STRING)?
        ('fontColor' '=' fontColor=Color)?;

MediaContainer:
    'media'
        'mediaLink' '=' mediaLink=STRING;

CodeContainer:
    'codeContainer'
        'language' '=' language=ID
        code=CODE_BLOCK;

// Types

Color returns string:
    STRING | HEX_COLOR;

type Position = 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM' | 'CENTER';
Position returns Position : LEFT | RIGHT | TOP | BOTTOM | CENTER;
LEFT returns string: 'LEFT';
RIGHT returns string: 'RIGHT';
TOP returns string: 'TOP';
BOTTOM returns string: 'BOTTOM';
CENTER returns string: 'CENTER';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal CODE_BLOCK: /```[\s\S]*?```/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/; // Permet de \ des "" pour un texte
terminal HEX_COLOR: /#[0-9a-fA-F]{6}/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
