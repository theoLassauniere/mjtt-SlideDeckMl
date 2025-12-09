grammar SlideDeckML
hidden(WS, COMMENT)

Game:
    'Game' name=ID description=TEXT NEWLINE (rules+=Riddle)+ (suggestions+=Suggestion)* ;

Riddle:
    'Riddle' name=ID question=TEXT 'Answer' answer=TEXT NEWLINE ;    

Suggestion:
    'Suggestion' text=TEXT 'for' riddle=[Riddle] 'at' 'time' minutes=INT ':' seconds=INT NEWLINE ;


terminal COMMENT: /§[^\n\r]*[\n\r]*/;
terminal NEWLINE: /[\n\r]+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal WS: /\s+/;
terminal INT returns number: /[0-9]+/;
terminal TEXT: /"[^"]*"|'[^']*'/;
