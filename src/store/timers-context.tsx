import { createContext, ReactNode, useContext, useReducer } from "react";

//single timer
export type Timer = {
    name: string;
    duration: number
}

//multiple timers
type TimersState = {
    isRunning: boolean;
    timers: Timer[]
};

const initialState: TimersState = {
    isRunning: true,
    timers: []
}

//combines Timers and all the function that will be executed later
type TimersContextValue = TimersState & {
    addTimer: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void
}

export const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
    const context = useContext(TimersContext);

    if (context === null) {
        throw new Error("TimersContext is null");
    }

    return context
}

type TimersContextProviderProps = {
    children: ReactNode
}

type StartTimersAction = {
    type: 'START_TIMERS'
}

type StopTimersAction = {
    type: 'STOP_TIMERS'
}

type AddTimersAction = {
    type: 'ADD_TIMER',
    payload: Timer
}

type Action = StartTimersAction | StopTimersAction | AddTimersAction;

function timersReducer(state: TimersState, action: Action): TimersState {
    switch (action.type) {
        case 'START_TIMERS':
            return {
                ...state,
                isRunning: true
            }
        case 'STOP_TIMERS':
            return {
                ...state,
                isRunning: false
            }
        case 'ADD_TIMER':
            return {
                ...state,
                timers: [
                    ...state.timers,
                    {
                        name: action.payload.name,
                        duration: action.payload.duration
                    }
                ]
            }
        default: return state
    }

}


export default function TimersContextProvider({ children }: TimersContextProviderProps) {
    //useReducer is similar to useState
    const [timersState, dispatch] = useReducer(timersReducer, initialState)

    const ctx: TimersContextValue = {
        timers: timersState.timers,
        isRunning: timersState.isRunning,
        addTimer(timerData) {
            dispatch({ type: 'ADD_TIMER', payload: timerData })
        },
        startTimers() {
            dispatch({ type: 'START_TIMERS' })
        },
        stopTimers() {
            dispatch({ type: 'STOP_TIMERS' })
        }
    }

    return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
}