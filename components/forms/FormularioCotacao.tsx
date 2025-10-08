"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { validarCPFComFallback, validarCEPComFallback } from '@/lib/apis/fallback-system';
import { DadosCotacao } from '@/types/cotacao';

interface FormularioCotacaoProps {
  tipoSeguro: 'auto' | 'moto' | 'frotas' | 'uber';
  onSubmit: (dados: DadosCotacao) => Promise<void>;
}

export function FormularioCotacao({ tipoSeguro, onSubmit }: FormularioCotacaoProps) {
  const [dados, setDados] = useState<Partial<DadosCotacao>>({
    tipoSeguro,
    fonte: 'website',
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : ''
  });

  const [loading, setLoading] = useState({
    cpf: false,
    cep: false,
    placa: false,
    telefone: false,
    email: false,
    submit: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Opções para selects
  const opcoesSexo = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' }
  ];

  const opcoesEstadoCivil = [
    { value: 'Solteiro', label: 'Solteiro' },
    { value: 'Casado', label: 'Casado' },
    { value: 'Divorciado', label: 'Divorciado' },
    { value: 'Viúvo', label: 'Viúvo' }
  ];

  const opcoesTipoVeiculo = [
    { value: 'carro', label: 'Carro' },
    { value: 'moto', label: 'Moto' }
  ];

  const opcoesUsoVeiculo = [
    { value: 'particular', label: 'Particular' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'uber', label: 'Uber' },
    { value: 'taxi', label: 'Taxi' }
  ];

  const opcoesCobertura = [
    { value: 'basica', label: 'Básica' },
    { value: 'completa', label: 'Completa' },
    { value: 'premium', label: 'Premium' }
  ];

  // Validação de CPF
  const handleCPFChange = async (cpf: string) => {
    setDados(prev => ({ ...prev, cpf }));
    
    if (cpf.length === 14) { // CPF completo com máscara
      setLoading(prev => ({ ...prev, cpf: true }));
      setErrors(prev => ({ ...prev, cpf: '' }));
      
      try {
        const resultado = await validarCPFComFallback(cpf);
        
        if (resultado.ok && resultado.parsed) {
          setDados(prev => ({
            ...prev,
            sexo: (resultado.parsed?.sexo as 'Masculino' | 'Feminino') || undefined,
            dataNascimento: resultado.parsed?.dataNascimento || '',
            estadoCivil: (resultado.parsed?.estadoCivil as 'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo') || undefined
          }));
        } else {
          setErrors(prev => ({ ...prev, cpf: 'CPF inválido ou não encontrado' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, cpf: 'Erro ao validar CPF' }));
      } finally {
        setLoading(prev => ({ ...prev, cpf: false }));
      }
    }
  };

  // Validação de CEP
  const handleCEPChange = async (cep: string) => {
    setDados(prev => ({ ...prev, cep }));
    
    if (cep.length === 9) { // CEP completo com máscara
      setLoading(prev => ({ ...prev, cep: true }));
      setErrors(prev => ({ ...prev, cep: '' }));
      
      try {
        const resultado = await validarCEPComFallback(cep);
        
        if (resultado.ok && resultado.parsed) {
          setDados(prev => ({
            ...prev,
            cidade: resultado.parsed?.cidade || '',
            estado: resultado.parsed?.estado || '',
            endereco: resultado.parsed?.endereco || ''
          }));
        } else {
          setErrors(prev => ({ ...prev, cep: 'CEP inválido ou não encontrado' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, cep: 'Erro ao validar CEP' }));
      } finally {
        setLoading(prev => ({ ...prev, cep: false }));
      }
    }
  };

  // Validação de email
  const handleEmailChange = (email: string) => {
    setDados(prev => ({ ...prev, email }));
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (email && !emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'E-mail inválido' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  // Validação de telefone
  const handleTelefoneChange = (telefone: string) => {
    setDados(prev => ({ ...prev, telefone }));
    
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length === 11) {
      setErrors(prev => ({ ...prev, telefone: '' }));
    } else if (telefoneLimpo.length > 0) {
      setErrors(prev => ({ ...prev, telefone: 'Telefone deve ter 11 dígitos' }));
    }
  };

  // Validação de placa
  const handlePlacaChange = (placa: string) => {
    setDados(prev => ({ ...prev, placa }));
    
    const placaLimpa = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/;
    const formatoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    if (placaLimpa.length === 7 && (formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa))) {
      setErrors(prev => ({ ...prev, placa: '' }));
    } else if (placaLimpa.length > 0) {
      setErrors(prev => ({ ...prev, placa: 'Placa inválida' }));
    }
  };

  // Submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    const camposObrigatorios = ['nome', 'cpf', 'email', 'telefone', 'placa', 'cep'];
    const novosErrors: Record<string, string> = {};
    
    camposObrigatorios.forEach(campo => {
      if (!dados[campo as keyof DadosCotacao]) {
        novosErrors[campo] = 'Campo obrigatório';
      }
    });
    
    if (Object.keys(novosErrors).length > 0) {
      setErrors(novosErrors);
      return;
    }
    
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
      await onSubmit(dados as DadosCotacao);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Pessoais */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome Completo"
            value={dados.nome || ''}
            onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
            error={errors.nome}
            required
          />
          
          <Input
            label="CPF"
            value={dados.cpf || ''}
            onChange={(e) => handleCPFChange(e.target.value)}
            error={errors.cpf}
            mask="cpf"
            loading={loading.cpf}
            required
          />
          
          <Input
            label="E-mail"
            type="email"
            value={dados.email || ''}
            onChange={(e) => handleEmailChange(e.target.value)}
            error={errors.email}
            required
          />
          
          <Input
            label="Telefone"
            value={dados.telefone || ''}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            error={errors.telefone}
            mask="telefone"
            required
          />
          
          <Input
            label="Data de Nascimento"
            type="date"
            value={dados.dataNascimento || ''}
            onChange={(e) => setDados(prev => ({ ...prev, dataNascimento: e.target.value }))}
          />
          
          <Select
            label="Sexo"
            value={dados.sexo || ''}
            onChange={(e) => setDados(prev => ({ ...prev, sexo: e.target.value as any }))}
            options={opcoesSexo}
            placeholder="Selecione o sexo"
          />
          
          <Select
            label="Estado Civil"
            value={dados.estadoCivil || ''}
            onChange={(e) => setDados(prev => ({ ...prev, estadoCivil: e.target.value as any }))}
            options={opcoesEstadoCivil}
            placeholder="Selecione o estado civil"
          />
        </div>
      </div>

      {/* Dados do Veículo */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Veículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Placa"
            value={dados.placa || ''}
            onChange={(e) => handlePlacaChange(e.target.value)}
            error={errors.placa}
            mask="placa"
            required
          />
          
          <Input
            label="Marca/Modelo"
            value={dados.marca || ''}
            onChange={(e) => setDados(prev => ({ ...prev, marca: e.target.value }))}
          />
          
          <Input
            label="Ano"
            value={dados.ano || ''}
            onChange={(e) => setDados(prev => ({ ...prev, ano: e.target.value }))}
          />
          
          <Select
            label="Tipo de Veículo"
            value={dados.tipoVeiculo || ''}
            onChange={(e) => setDados(prev => ({ ...prev, tipoVeiculo: e.target.value as any }))}
            options={opcoesTipoVeiculo}
            placeholder="Selecione o tipo"
          />
          
          <Select
            label="Uso do Veículo"
            value={dados.usoVeiculo || ''}
            onChange={(e) => setDados(prev => ({ ...prev, usoVeiculo: e.target.value as any }))}
            options={opcoesUsoVeiculo}
            placeholder="Selecione o uso"
          />
        </div>
      </div>

      {/* Dados de Endereço */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CEP"
            value={dados.cep || ''}
            onChange={(e) => handleCEPChange(e.target.value)}
            error={errors.cep}
            mask="cep"
            loading={loading.cep}
            required
          />
          
          <Input
            label="Cidade"
            value={dados.cidade || ''}
            onChange={(e) => setDados(prev => ({ ...prev, cidade: e.target.value }))}
            disabled
          />
          
          <Input
            label="Estado"
            value={dados.estado || ''}
            onChange={(e) => setDados(prev => ({ ...prev, estado: e.target.value }))}
            disabled
          />
          
          <Input
            label="Endereço"
            value={dados.endereco || ''}
            onChange={(e) => setDados(prev => ({ ...prev, endereco: e.target.value }))}
            disabled
          />
          
          <Input
            label="Número"
            value={dados.numero || ''}
            onChange={(e) => setDados(prev => ({ ...prev, numero: e.target.value }))}
          />
          
          <Input
            label="Complemento"
            value={dados.complemento || ''}
            onChange={(e) => setDados(prev => ({ ...prev, complemento: e.target.value }))}
          />
        </div>
      </div>

      {/* Dados do Seguro */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Seguro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Cobertura"
            value={dados.cobertura || ''}
            onChange={(e) => setDados(prev => ({ ...prev, cobertura: e.target.value as any }))}
            options={opcoesCobertura}
            placeholder="Selecione a cobertura"
          />
          
          <Input
            label="Franquia"
            value={dados.franquia || ''}
            onChange={(e) => setDados(prev => ({ ...prev, franquia: e.target.value }))}
          />
        </div>
      </div>

      {/* Botão de Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          loading={loading.submit}
          disabled={Object.keys(errors).some(key => errors[key])}
          className="px-8 py-3"
        >
          Solicitar Cotação
        </Button>
      </div>
    </form>
  );
}
