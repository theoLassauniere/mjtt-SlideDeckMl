grammar SlideDeckMl

entry Presentation:
    'Presentation' name=ID '{'
        template=Template
        slides+=Slide*
    '}';

Template:
    'Template'
        ('logos' '=' '[' logos+=Logo* ']')?
        ('companyName' '=' companyName=STRING)?
        ('fontName' '=' fontName=STRING)
        ('fontSize' '=' fontSize=STRING)
        ('fontColor' '=' fontColor=Color)
        ('backgroundColor' '=' backgroundColor=Color)?;

Logo:
    'logo'
        path=STRING
        (positions+=Position)*
        ('size' width=INT (height=INT)?)?;

Slide:
    'Slide' '{'
        ('title' '=' title=STRING)?
        ('backgroundColor' '=' backgroundColor=Color)?
        (content=SlideContent)?
    '}';

SlideContent:
    containers+=Container+ | grid=Grid;

Grid:
    'grid' rows=INT ':' columns=INT '{'
        cells+=Cell+
    '}';

Cell:
    rowIndexStart=INT('-' rowIndexEnd=INT)? ':' columnIndexStart=INT('-' columnIndexEnd=INT)? '{'
        (containers+=Container* | grid=Grid)
    '}';

Container:
    TextContainer | MediaContainer | CodeContainer
;

TextContainer:
    'text'
        text=STRING
        ('fontSize' '=' fontSize=STRING)?
        ('fontColor' '=' fontColor=Color)?;

MediaContainer:
    'media'
        mediaLink=STRING;

CodeContainer:
    'code'
        language=ID
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
