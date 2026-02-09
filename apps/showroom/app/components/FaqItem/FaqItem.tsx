'use client';

import { useState } from 'react';
import * as S from './FaqItem.styles';

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <S.Wrapper isOpen={isOpen}>
      <S.Button onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        <span>{question}</span>
        <S.Toggle isOpen={isOpen}>+</S.Toggle>
      </S.Button>
      {isOpen && <S.Answer>{answer}</S.Answer>}
    </S.Wrapper>
  );
}
