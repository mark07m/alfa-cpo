'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/admin/ui/Modal';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Label } from '@/components/admin/ui/Label';
import { Alert } from '@/components/admin/ui/Alert';
import { CompensationFund, CompensationFundFormData } from '@/types/admin';

const compensationFundSchema = z.object({
  amount: z.number().min(0, 'Сумма не может быть отрицательной'),
  currency: z.string().min(1, 'Валюта обязательна'),
  bankDetails: z.object({
    bankName: z.string().min(1, 'Название банка обязательно'),
    accountNumber: z.string().min(1, 'Номер счета обязателен'),
    bik: z.string().min(9, 'БИК должен содержать 9 цифр').max(9, 'БИК должен содержать 9 цифр'),
    correspondentAccount: z.string().min(1, 'Корреспондентский счет обязателен'),
    inn: z.string().min(10, 'ИНН должен содержать 10 цифр').max(10, 'ИНН должен содержать 10 цифр'),
    kpp: z.string().min(9, 'КПП должен содержать 9 цифр').max(9, 'КПП должен содержать 9 цифр'),
  })
});

interface CompensationFundFormProps {
  fundInfo: CompensationFund;
  onSave: (data: CompensationFundFormData) => Promise<void>;
  onCancel: () => void;
}

export function CompensationFundForm({ fundInfo, onSave, onCancel }: CompensationFundFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CompensationFundFormData>({
    resolver: zodResolver(compensationFundSchema),
    defaultValues: {
      amount: fundInfo.amount,
      currency: fundInfo.currency,
      bankDetails: fundInfo.bankDetails
    }
  });

  const onSubmit = async (data: CompensationFundFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(data);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleCancel}
      title="Редактировать компенсационный фонд"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert type="error" title="Ошибка" message={error} />
        )}

        {/* Основная информация */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Основная информация</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Сумма *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">Валюта *</Label>
              <select
                id="currency"
                {...register('currency')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.currency ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="RUB">RUB (Российский рубль)</option>
                <option value="USD">USD (Доллар США)</option>
                <option value="EUR">EUR (Евро)</option>
              </select>
              {errors.currency && (
                <p className="text-sm text-red-600 mt-1">{errors.currency.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Банковские реквизиты */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Банковские реквизиты</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Название банка *</Label>
              <Input
                id="bankName"
                {...register('bankDetails.bankName')}
                className={errors.bankDetails?.bankName ? 'border-red-500' : ''}
              />
              {errors.bankDetails?.bankName && (
                <p className="text-sm text-red-600 mt-1">{errors.bankDetails.bankName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountNumber">Номер счета *</Label>
                <Input
                  id="accountNumber"
                  {...register('bankDetails.accountNumber')}
                  className={errors.bankDetails?.accountNumber ? 'border-red-500' : ''}
                />
                {errors.bankDetails?.accountNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.bankDetails.accountNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bik">БИК *</Label>
                <Input
                  id="bik"
                  {...register('bankDetails.bik')}
                  className={errors.bankDetails?.bik ? 'border-red-500' : ''}
                />
                {errors.bankDetails?.bik && (
                  <p className="text-sm text-red-600 mt-1">{errors.bankDetails.bik.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="correspondentAccount">Корреспондентский счет *</Label>
              <Input
                id="correspondentAccount"
                {...register('bankDetails.correspondentAccount')}
                className={errors.bankDetails?.correspondentAccount ? 'border-red-500' : ''}
              />
              {errors.bankDetails?.correspondentAccount && (
                <p className="text-sm text-red-600 mt-1">{errors.bankDetails.correspondentAccount.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inn">ИНН *</Label>
                <Input
                  id="inn"
                  {...register('bankDetails.inn')}
                  className={errors.bankDetails?.inn ? 'border-red-500' : ''}
                />
                {errors.bankDetails?.inn && (
                  <p className="text-sm text-red-600 mt-1">{errors.bankDetails.inn.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="kpp">КПП *</Label>
                <Input
                  id="kpp"
                  {...register('bankDetails.kpp')}
                  className={errors.bankDetails?.kpp ? 'border-red-500' : ''}
                />
                {errors.bankDetails?.kpp && (
                  <p className="text-sm text-red-600 mt-1">{errors.bankDetails.kpp.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
