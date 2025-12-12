"use client";

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export interface PromptFormData {
  temperature: number;
  tokenUsage: number;
  prompt: string;
}

interface PromptInputFormProps {
  readonly onSubmit: (data: PromptFormData) => void;
}

export default function PromptInputForm({ onSubmit }: PromptInputFormProps) {
  const [temperature, setTemperature] = useState<number>(0.7);
  const [tokenUsage, setTokenUsage] = useState<number>(128);
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      temperature,
      tokenUsage,
      prompt,
    });
    setTemperature(0.7);
    setTokenUsage(128);
    setPrompt('');
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Prompt
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Temperature"
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
          inputProps={{
            step: 0.1,
            min: 0,
            max: 1,
          }}
          helperText="Controls randomness (0 = deterministic, 1 = less deterministic)"
          fullWidth
          required
        />

        <TextField
          label="Token Usage"
          type="number"
          value={tokenUsage}
          onChange={(e) => setTokenUsage(Number.parseInt(e.target.value))}
          inputProps={{
            step: 1,
            min: 1,
            max: 2048,
          }}
          helperText="Maximum number of tokens to generate"
          fullWidth
          required
        />

        <TextField
          label="Prompt"
          multiline
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          helperText="The text prompt to send to the model"
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={!prompt.trim()}
        >
          Submit Prompt
        </Button>
      </Box>
    </Paper>
  );
}
