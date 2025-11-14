'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mfaSchema, MFAFormData } from '@/lib/schemas/auth-schemas'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function MFAForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { verifyMFA } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
  })

  const onSubmit = async (data: MFAFormData) => {
    setLoading(true)
    try {
      const success = await verifyMFA(data.code)
      
      if (success) {
        toast({
          title: 'Verification successful!',
          description: 'You have been authenticated.',
        })
        router.push('/results')
      } else {
        toast({
          title: 'Verification failed',
          description: 'Invalid code. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify code.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              {...register('code')}
            />
            {errors.code && (
              <p className="text-sm text-destructive mt-1">
                {errors.code.message}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            For demo purposes, enter any 6-digit code
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Back to Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

