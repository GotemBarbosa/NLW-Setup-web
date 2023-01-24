import dayjs from "dayjs"
import { Flag, Trash } from "phosphor-react"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import * as Popover from '@radix-ui/react-popover'
import axios from "axios"

type habitProps = Array<{
    id: string,
    title: string,
    created_at: Date,
    weekDays: number[]
    completed: boolean,
    completed_data?:{
      completed_date:  Date | undefined
    } 
  }>

export function HabitsVizualization(){
    
    const [habits,setHabits] = useState<habitProps>([])
    const [thereIsFinished,setThereIsFinished] = useState<boolean>(false)

    useEffect(()=>{
        api.get('/allHabits').then(response =>{
            setHabits(response.data)
        })
    },[])

    async function updateData(){
        await api.get('/allHabits').then(response =>{
            setHabits(response.data)
        })
    }

    function parseWeekDays(weekDays: number[]){
        let weekDaysParsed: string[] = []
        if(weekDays.length>0){
            weekDays.map((weekDay)=>{
                const prevWeekDaysParsed = weekDaysParsed
                if(weekDay === 0) weekDaysParsed = [...prevWeekDaysParsed, 'Dom']
                if(weekDay === 1) weekDaysParsed = [...prevWeekDaysParsed, 'Seg']
                if(weekDay === 2) weekDaysParsed = [...prevWeekDaysParsed, 'Ter']
                if(weekDay === 3) weekDaysParsed = [...prevWeekDaysParsed, 'Qua']
                if(weekDay === 4) weekDaysParsed = [...prevWeekDaysParsed, 'Qui']
                if(weekDay === 5) weekDaysParsed = [...prevWeekDaysParsed, 'Sex']
                if(weekDay === 6) weekDaysParsed = [...prevWeekDaysParsed, 'Sab']
            })
        }
        return weekDaysParsed
    }

    async function handleDeleteHabit(id:string){
        try{
            await api.delete(`/habits/${id}/delete`)
            updateData()
        }catch(error){
            console.log(error)
            alert('Ops... algo deu errado ao deletar o hábito')
        }
    }

    async function handleFinishHabit(id:string) {
        try{
            await api.post('/completedHabits',{
                id
            })
            updateData()
        }catch(error){
            alert('Ops... algo deu errado ao finalizar o hábito')
            console.log(error)
        }
    }

    return(
        <div className="w-full flex flex-col mt-6">
            {habits.length > 0?
                <div className="grid grid-flow-col mt-5 items-center justify-center grid-cols-[1.5fr_1fr_2fr_1fr]">
                    <span className="font-extrabold text-zinc-300"> Hábito</span>
                    <span className="font-extrabold text-zinc-300"> Criado em </span>
                    <span className="font-extrabold text-zinc-300"> Dias da semana </span>
                    <span></span>
                </div>: <span className="font-bold text-zinc-400">Você ainda não cadastrou nenhum hábito 😢</span>           
            }
            
            {habits.length > 0 && habits.map(habit=>{
                
                const date = dayjs(habit.created_at).format('DD/MM/YY')
                const days = parseWeekDays(habit.weekDays)
                if(!habit.completed){
                    return(
                        <div key={habit.id} className="grid grid-flow-col mt-5 items-center justify-center grid-cols-[1.5fr_1fr_2fr_1fr]">
                            <span className="font-semibold leading-tight">{habit.title}</span>
                            <span>{date}</span>
                            <div className="flex gap-1">
                                {days.map((day)=>{
                                    return(
                                        <div key={day} className='rounded-2xl bg-slate-400 w-7 h-7 flex justify-center items-center text-center'>
                                            <span className="text-xs">{day}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex w-full items-center justify-end gap-3"> 

                                <Popover.Root>
                                <Popover.Trigger className="p-1 bg-zinc-700 rounded-2xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus: ring-offset-zinc-900">
                                    <Flag size={22} className='text-white'/>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-600 flex flex-col justify-center items-center'>
                                        <span className="font-bold text-sm">Você deseja finalizar o hábito "{habit.title}"?</span>
                                        <span className="text-xs text-gray-300">Esse hábito não aparecerá nos seus dias, porém seus registros permanecerão.</span>
                                        <div className="flex gap-2 mt-3">
                                            <Popover.Close className="p-1 rounded-md border font-bold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-600">
                                                Cancelar
                                            </Popover.Close>
                                            <Popover.Close className="p-1 rounded-md border border-green-400 text-green-300  font-bold focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-zinc-600" onClick={()=>{handleFinishHabit(habit.id)}}>
                                                Finalizar
                                            </Popover.Close>
                                        </div>
                                        <Popover.Arrow className='fill-zinc-600' height={8} width={16} />
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
    
                                <Popover.Root>
                                <Popover.Trigger className="p-1 bg-zinc-700 rounded-2xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900">
                                    <Trash size={22} className='text-red-600'/>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-600 flex flex-col justify-center items-center'>
                                        <span className="font-bold text-sm">Você realmente deseja apagar o hábito "{habit.title}"?</span>
                                        <span className="text-xs text-gray-300">Todos os registros relacionados a este hábito serão apagados</span>
                                        <div className="flex gap-2 mt-3">
                                            <Popover.Close className="p-1 rounded-md border font-bold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-600">
                                                Cancelar
                                            </Popover.Close>
                                            <Popover.Close className="p-1 rounded-md border border-red-400 text-red-300  font-bold focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-zinc-600" 
                                                onClick={()=>{handleDeleteHabit(habit.id)}}
                                            >
                                                Apagar
                                            </Popover.Close>
                                        </div>
                                        <Popover.Arrow className='fill-zinc-600' height={8} width={16} />
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                            </div>
                            
                        </div>
                    )
                }
            })}
            {(habits.length > 0) &&
                <span className="mt-4 text-lg font-extrabold">
                Hábitos finalizados:
            </span>        
            }
            
            {habits.length > 0 && habits.map(habit=>{
                
                const date = dayjs(habit.created_at).format('DD/MM/YY')
                const days = parseWeekDays(habit.weekDays)
                if(habit.completed){
                    return(
                        <div key={habit.id} className="grid grid-flow-col mt-5 items-center justify-center grid-cols-[1.5fr_1fr_2fr_1fr]">
                        <span className="font-semibold leading-tight text-zinc-400">{habit.title}</span>
                        <span className="text-zinc-400">{date}</span>
                        <div className="flex gap-1">
                            {days.map((day)=>{
                                return(
                                    <div key={day} className='rounded-2xl bg-slate-500 w-7 h-7 flex justify-center items-center text-center '>
                                        <span className="text-xs text-zinc-200">{day}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex w-full items-center justify-end gap-3"> 
                            <Popover.Root>
                                <Popover.Trigger className="p-1 bg-zinc-700 rounded-2xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900">
                                    <Trash size={22} className='text-red-600'/>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-600 flex flex-col justify-center items-center'>
                                        <span className="font-bold text-sm">Você realmente deseja apagar esse hábito?</span>
                                        <span className="text-xs text-gray-300">Todos os registros relacionados a este hábito serão apagados</span>
                                        <div className="flex gap-2 mt-3">
                                            <Popover.Close className="p-1 rounded-md border font-bold ">
                                                Cancelar
                                            </Popover.Close>
                                            <Popover.Close className="p-1 rounded-md border border-red-400 text-red-300  font-bold focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-zinc-600" 
                                                onClick={()=>{handleDeleteHabit(habit.id)}}
                                            >
                                                Apagar
                                            </Popover.Close>
                                        </div>
                                        <Popover.Arrow className='fill-zinc-600' height={8} width={16} />
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                        </div>
                        
                    </div>
                    )
                }
            })}
        </div>
    )
}

