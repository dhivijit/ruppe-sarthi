/* eslint-disable padded-blocks */
'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { PlusCircle, MinusCircle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { getExpenses, createExpense, getIncome, createIncome } from "@/lib/financetracking";
import { getUserData } from '@/lib/userData';

type Transaction = {
  id?: string
  type: 'expense' | 'income'
  amount: number
  category: string
  date: Date
  description?: string
}

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Salary', 'Other']

export default function FinanceTracker({ email }: { email: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [description, setDescription] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)
  const [balance, setBalance] = useState<number>(0);

  const handleSubmit = async () => {
    const newTransaction: Transaction = {
      type: formType,
      amount: parseFloat(amount),
      category,
      date: new Date(date),
      description,
    }

    if (formType === 'expense') {
      if (await createExpense(email, newTransaction.amount, newTransaction.category, newTransaction.date, newTransaction.description)) {
        setBalance(balance - newTransaction.amount)
        alert('Expense created successfully')
      } else {
        alert('Error creating expense')
      }
    } else {
      if (await createIncome(email, newTransaction.amount, newTransaction.category, newTransaction.date, newTransaction.description)) {
        setBalance(balance + newTransaction.amount)
        alert('Income created successfully')
      } else {
        alert('Error creating income')
      }
    }

    setTransactions([...transactions, newTransaction])
    resetForm()
  }


  const resetForm = () => {
    setAmount('')
    setCategory('')
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setShowForm(false)
  }

  const openForm = (type: 'expense' | 'income') => {
    setFormType(type)
    setShowForm(true)
  }

  useEffect(() => {
    async function dataGetter() {
      const userData = await getUserData(email);
      console.log(userData)
      setBalance(userData.user?.balance || 0);
    }
    dataGetter();
  }, [email]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const expenses = await getExpenses(email)
      const incomes = await getIncome(email)

      const allTransactions: any = []
      if (expenses.success && expenses.data) {
        // allTransactions.push(...expenses.data)
        // push the expenses to the transactions array with the type as expense
        allTransactions.push(...expenses.data.map((expense: any) => ({ ...expense, type: 'expense' })))
      }
      if (incomes.success && incomes.data) {
        // allTransactions.push(...incomes.data)
        // push the incomes to the transactions array with the type as income as in Transaction type
        allTransactions.push(...incomes.data.map((income: any) => ({ ...income, type: 'income' })))
      }

      setTransactions(allTransactions)
    }

    fetchTransactions()
  }, [email])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target === overlayRef.current) {
        resetForm()
      }
    }

    if (showForm) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showForm])

  const sortedTransactions = transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
  const expenses = sortedTransactions.filter(t => t.type === 'expense')
  const incomes = sortedTransactions.filter(t => t.type === 'income')

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Finance Tracker</h1>
      <h3 className="font-title text-xl text-neutral-950">Your current balance is ${balance}</h3>

      <div className="flex flex-wrap gap-4 mb-4">
        <Button onClick={() => openForm('expense')}>
          <MinusCircle className="mr-2 h-4 w-4" /> New Expense
        </Button>
        <Button onClick={() => openForm('income')}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Income
        </Button>
      </div>

      {showForm && (
        <div ref={overlayRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{formType === 'expense' ? 'New Expense' : 'New Income'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description(optional)</Label>
                    <Input id="description"
                      type="text"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit}>Submit</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Expenses</h2>
          {expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(expense.date, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No transactions available</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Incomes</h2>
          {incomes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell>{format(income.date, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{income.category}</TableCell>
                    <TableCell className="text-right">${income.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No transactions available</p>
          )}
        </div>
      </div>
    </div>
  )
}