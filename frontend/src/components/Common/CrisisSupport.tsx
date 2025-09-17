import React, { useState } from 'react';
import styled from 'styled-components';
import { AlertTriangle, Phone, MessageCircle, Heart, X, ExternalLink } from 'lucide-react';

const CrisisOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
`;

const CrisisModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #2d3748;
  }
`;

const CrisisHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const CrisisTitle = styled.h2`
  color: #e53e3e;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const CrisisSubtitle = styled.p`
  color: #2d3748;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0;
`;

const ResourceSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResourceItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  color: #2d3748;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4299e1;
    background: #ebf8ff;
    transform: translateY(-1px);
  }
`;

const ResourceIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ResourceInfo = styled.div`
  flex: 1;
`;

const ResourceName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const ResourceDescription = styled.div`
  font-size: 0.85rem;
  color: #718096;
  line-height: 1.4;
`;

const ResourceNumber = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #e53e3e;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
    }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }
  `}
`;

const ImmediateDanger = styled.div`
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border: 2px solid #e53e3e;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const DangerText = styled.div`
  color: #742a2a;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const EmergencyButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #e53e3e;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c53030;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
  }
`;

interface CrisisSupportProps {
  isVisible: boolean;
  onClose: () => void;
  severity?: 'low' | 'medium' | 'high';
}

const CrisisSupport: React.FC<CrisisSupportProps> = ({ 
  isVisible, 
  onClose, 
  severity = 'medium' 
}) => {
  const [showAllResources, setShowAllResources] = useState(false);

  const emergencyResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "Free, confidential support 24/7",
      color: "#e53e3e",
      icon: Phone,
      href: "tel:988"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free, 24/7 crisis counseling via text",
      color: "#4299e1",
      icon: MessageCircle,
      href: "sms:741741&body=HOME"
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate danger or medical emergencies",
      color: "#e53e3e",
      icon: AlertTriangle,
      href: "tel:911"
    }
  ];

  const supportResources = [
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      color: "#48bb78",
      icon: Phone,
      href: "tel:18006624357"
    },
    {
      name: "NAMI HelpLine",
      number: "1-800-950-6264",
      description: "National Alliance on Mental Illness support",
      color: "#9f7aea",
      icon: Heart,
      href: "tel:18009506264"
    },
    {
      name: "Veterans Crisis Line",
      number: "1-800-273-8255",
      description: "24/7 support for veterans and their families",
      color: "#ed8936",
      icon: Phone,
      href: "tel:18002738255"
    },
    {
      name: "LGBT National Hotline",
      number: "1-888-843-4564",
      description: "Support for LGBTQ+ individuals",
      color: "#38b2ac",
      icon: Heart,
      href: "tel:18888434564"
    },
    {
      name: "Teen Line",
      number: "1-800-852-8336",
      description: "Teens helping teens",
      color: "#4299e1",
      icon: MessageCircle,
      href: "tel:18008528336"
    }
  ];

  const handleCallEmergency = () => {
    window.open('tel:988', '_self');
  };

  const handleContinueChat = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <CrisisOverlay isVisible={isVisible}>
      <CrisisModal>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>

        <CrisisHeader>
          <CrisisTitle>
            <AlertTriangle size={24} />
            Crisis Support Available
          </CrisisTitle>
          <CrisisSubtitle>
            You don't have to face this alone. Help is available right now.
          </CrisisSubtitle>
        </CrisisHeader>

        {severity === 'high' && (
          <ImmediateDanger>
            <DangerText>
              If you're in immediate danger or having thoughts of suicide, please reach out for help now.
            </DangerText>
            <EmergencyButton href="tel:988">
              <Phone size={20} />
              Call 988 - Suicide & Crisis Lifeline
            </EmergencyButton>
          </ImmediateDanger>
        )}

        <ResourceSection>
          <SectionTitle>
            <AlertTriangle size={20} color="#e53e3e" />
            Immediate Help (24/7)
          </SectionTitle>
          <ResourceList>
            {emergencyResources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <ResourceItem key={index} href={resource.href}>
                  <ResourceIcon color={resource.color}>
                    <IconComponent size={20} />
                  </ResourceIcon>
                  <ResourceInfo>
                    <ResourceName>{resource.name}</ResourceName>
                    <ResourceDescription>{resource.description}</ResourceDescription>
                  </ResourceInfo>
                  <ResourceNumber>{resource.number}</ResourceNumber>
                </ResourceItem>
              );
            })}
          </ResourceList>
        </ResourceSection>

        {(showAllResources || severity !== 'high') && (
          <ResourceSection>
            <SectionTitle>
              <Heart size={20} color="#48bb78" />
              Additional Support Resources
            </SectionTitle>
            <ResourceList>
              {supportResources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <ResourceItem key={index} href={resource.href}>
                    <ResourceIcon color={resource.color}>
                      <IconComponent size={20} />
                    </ResourceIcon>
                    <ResourceInfo>
                      <ResourceName>{resource.name}</ResourceName>
                      <ResourceDescription>{resource.description}</ResourceDescription>
                    </ResourceInfo>
                    <ResourceNumber>{resource.number}</ResourceNumber>
                  </ResourceItem>
                );
              })}
            </ResourceList>
          </ResourceSection>
        )}

        {!showAllResources && severity === 'high' && (
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <button
              onClick={() => setShowAllResources(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4299e1',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Show more resources
            </button>
          </div>
        )}

        <ActionButtons>
          {severity === 'high' ? (
            <>
              <ActionButton variant="primary" onClick={handleCallEmergency}>
                <Phone size={16} style={{ marginRight: '0.5rem' }} />
                Call for Help
              </ActionButton>
              <ActionButton variant="secondary" onClick={handleContinueChat}>
                Continue Conversation
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton variant="secondary" onClick={onClose}>
                I'm Safe - Continue Chat
              </ActionButton>
              <ActionButton variant="primary" onClick={handleCallEmergency}>
                I Need Help Now
              </ActionButton>
            </>
          )}
        </ActionButtons>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f7fafc', 
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#718096',
          textAlign: 'center'
        }}>
          <strong>Remember:</strong> This AI assistant is not a replacement for professional help. 
          If you're experiencing a mental health crisis, please reach out to the resources above.
        </div>
      </CrisisModal>
    </CrisisOverlay>
  );
};

export default CrisisSupport;
