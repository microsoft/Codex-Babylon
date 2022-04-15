export interface IState {
    code: string;
}

export class UndoRedo {

    undoStack: IState[];
    redoStack: IState[];
    undoAction?: (state: IState[]) => void;
    redoAction?: (state: IState) => void;

    constructor(undoAction?, redoAction?) {
        this.undoStack = [];
        this.redoStack = []; 
        
        this.undoAction = undoAction;
        this.redoAction = redoAction;
    }

    append = (command: IState) => {        
        this.undoStack.push(command);
    }

    undo = async () : Promise<boolean> =>  {
        var undoThis = this.undoStack.pop();
        
        if(undoThis !== undefined) {
            this.redoStack.push(undoThis);
            this.undoAction?.(this.undoStack);        
        }

        return undoThis !== undefined;
    };

    redo = async () : Promise<boolean> =>  {
        var redoThis = this.redoStack.pop();

        if(redoThis !== undefined) {
            this.undoStack.push(redoThis);
            this.redoAction?.(redoThis);
        }

        return redoThis !== undefined;
    };

    reset = async () => {
        this.undoStack.splice(0);
        this.redoStack.splice(0);
    }
}