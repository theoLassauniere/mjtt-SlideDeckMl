grammar SlideDeckMl

entry Presentation:
    'Presentation' name=ID '{'
        numbered=Numbering?
        (annotations?='annotations')?
        template=Template
        slides+=Slide*
    '}';

Numbering:
    'numbered'
    ('start' start=INT)?;

Template:
    'Template' '{'
        ('overlays' '=' '[' (overlays+=OverlayElement (',' overlays+=OverlayElement)*)? ']')?
        ('fontName' '=' fontName=STRING)
        ('fontSize' '=' fontSize=STRING)
        ('fontColor' '=' fontColor=Color)
        ('titlesSize' '=' titlesSize=STRING)
        ('backgroundColor' '=' backgroundColor=Color)?
        ('backgroundImage' '=' backgroundImage=STRING)?
        ('transitions' '=' transitions=Transition)?
    '}';

OverlayElement:
    content=OverlayContent
    (position=Alignment)?;

OverlayContent:
      TextContainer | OverlayImage;

OverlayImage:
    'image' path=STRING
    ('size' '=' width=INT (height=INT)?)?;

Slide:
    'Slide' '{'
        ('title' '=' title=STRING)?
        ('backgroundColor' '=' backgroundColor=Color)?
        ('titleSize' '=' titleSize=STRING)?
        ('backgroundImage' '=' backgroundImage=STRING)?
        ('transition' '=' transition=Transition)?
        (content=SlideContent)?
    '}';

Transition returns string:
      'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';

SlideContent:
    containers+=Container+ | grid=Grid;

Grid:
    'grid' rows=INT ':' columns=INT '{'
        cells+=Cell+
    '}';

Cell:
    rowIndexStart=INT('-' rowIndexEnd=INT)? ':' columnIndexStart=INT('-' columnIndexEnd=INT)? '{'
        ('position' '=' position=Alignment)?
        (containers+=Container* | grid=Grid)
    '}';

Container:
    TextContainer | MediaContainer | CodeContainer
;

TextContainer:
    'text'
        ('fontSize' '=' fontSize=STRING)?
        ('fontColor' '=' fontColor=Color)?
        (
            single=TextElement
          |
            '{' elements+=TextElement+ '}'
        )
    ;

TextElement:
      PlainText
    | List
;

PlainText:
    text=STRING
;

List:
    (ordered?='ol' | unordered?='ul')
        items+=STRING+
;

MediaContainer:
    'media'
        mediaLink=STRING;

CodeContainer:
    'code'
        language=ID
        code=CODE_BLOCK
        ('steps' steps=STEP_RANGES)?;

Alignment:
    vertical=('TOP' | 'BOTTOM') (horizontal=('LEFT' | 'RIGHT' | 'CENTER'))?
    |
    horizontal=('LEFT' | 'RIGHT') (vertical=('TOP' | 'BOTTOM' | 'CENTER'))?
    |
    vertical='CENTER' (horizontal=('LEFT' | 'RIGHT' | 'CENTER'))?
;

Color returns string:
    STRING | HEX_COLOR;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal CODE_BLOCK: /```[\s\S]*?```/;
terminal STEP_RANGES: '[' /[^\]]+/ ']';
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal HEX_COLOR: /#[0-9a-fA-F]{6}/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
