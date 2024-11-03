'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getUserData, changeName } from "@/lib/userData";

export default function UserProfile({ email }: { email: string }) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        async function fetchData() {
            const userData = await getUserData(email)
            if (userData.success) {
                setFirstName(userData.user.firstname)
                setLastName(userData.user.lastname)
            }
        }
        fetchData()
    }, [email])

    const handleNameChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (window.confirm('Are you sure you want to change your name?')) {
            await changeName(email, firstName, lastName)
            window.location.reload();
        }
    }

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmNewPassword) {
            setPasswordError('New passwords do not match')
            return
        }
        setPasswordError('')
        if (window.confirm('Are you sure you want to change your password?')) {
            // Reset fields after submission
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        }
    }

    return (
        <div className="space-y-6 max-w-md mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Change Name</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleNameChange} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Confirm Name Change</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmNewPassword" className="text-sm font-medium">Confirm New Password</label>
                            <Input
                                id="confirmNewPassword"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        <Button type="submit">Confirm Password Change</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}