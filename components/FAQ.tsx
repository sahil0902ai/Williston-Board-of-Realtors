"use client"
import { useState } from 'react'

const faqs = [
  {
    q: "Is my investment safe with Williston?",
    a: "Yes. All investments are secured against real physical property assets. We are LLC registered and SEC compliant. Your capital is backed by tangible real estate — not speculation. In our 8+ years of operation we have never defaulted on a single investor payout."
  },
  {
    q: "What is the minimum amount I can invest?",
    a: "You can start investing with as little as $500 through our Foundation Plan which offers 18% annual returns. There is no maximum limit. Larger investments qualify for higher return tiers up to 35%+ per annum."
  },
  {
    q: "How do I receive my returns?",
    a: "Returns are paid monthly directly to your wallet balance inside your dashboard. You can then withdraw to your Cash App, Zelle, bank account, or crypto wallet at any time. Withdrawals are processed within 24-48 business hours."
  },
  {
    q: "How do I deposit money into my account?",
    a: "You can deposit via Cash App ($WillistonInvest), Zelle (willistonboardofrealtors@gmail.com), bank wire transfer, or cryptocurrency (Bitcoin, USDT, Ethereum). Log into your dashboard, click Deposit, choose your method and follow the instructions."
  },
  {
    q: "How does withdrawal work?",
    a: "Go to your Dashboard, click Withdraw, enter the amount and your payout details (Cash App tag, Zelle email, bank account or crypto wallet). Your request is reviewed and funds sent within 24-48 hours. Minimum withdrawal is $100."
  },
  {
    q: "Can I invest from outside the United States?",
    a: "Yes. We welcome international investors. You can fund your account via international wire transfer or cryptocurrency from anywhere in the world. Returns are paid in USD."
  },
  {
    q: "How does the referral program work?",
    a: "Share your unique referral link from your dashboard. When someone signs up and invests using your link you earn 5% to 10% commission instantly credited to your wallet. There is no limit on how many people you can refer."
  },
  {
    q: "Can I withdraw my investment before it matures?",
    a: "Early withdrawals are allowed but subject to a 10% penalty fee on your principal. We recommend holding to maturity to receive your full returns. Contact our team on Telegram before making an early withdrawal."
  },
  {
    q: "What documents do I need to register?",
    a: "You need a valid email address and a government-issued ID (driver's license or passport) for KYC verification. KYC is required before your first withdrawal to protect all investors on the platform."
  },
  {
    q: "Do you accept cryptocurrency payments?",
    a: "Yes. We accept Bitcoin (BTC), USDT (TRC20), and Ethereum (ETH). Crypto deposits are confirmed after blockchain verification which typically takes 15-45 minutes. Your wallet is credited automatically."
  },
  {
    q: "How are properties allocated to investors?",
    a: "Property allocation depends on your investment tier. Prosperity plan and above investors are eligible for real estate unit allocation. Legacy and Dynasty investors receive guaranteed property allocation with full title documentation."
  },
  {
    q: "Is Williston registered with the SEC?",
    a: "Yes. Williston Board of Realtors and Investments is a registered LLC operating in full compliance with US investment regulations. All investment activities are transparent and documented. Legal agreements are provided for every investment."
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      style={{
        padding: '100px 60px',
        background: '#04091A',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '16px',
          }}>
            <span style={{
              display: 'block',
              width: '24px',
              height: '1px',
              background: '#C9A84C',
            }} />
            Got Questions?
          </span>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '48px',
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.1,
          }}>
            Everything You Need <span style={{ color: '#C9A84C' }}>To Know</span>
          </h2>
        </div>

        {/* FAQ Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                border: `1px solid ${openIndex === index
                  ? 'rgba(201,168,76,0.4)'
                  : 'rgba(255,255,255,0.07)'}`,
                background: openIndex === index
                  ? 'rgba(201,168,76,0.04)'
                  : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              {/* Question Button */}
              <button
                onClick={() => toggle(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '16px',
                }}
              >
                <span style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: openIndex === index ? '#C9A84C' : '#ffffff',
                  lineHeight: 1.4,
                  transition: 'color 0.3s',
                }}>
                  {faq.q}
                </span>
                <span style={{
                  flexShrink: 0,
                  width: '28px',
                  height: '28px',
                  border: `1px solid ${openIndex === index
                    ? '#C9A84C'
                    : 'rgba(255,255,255,0.15)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: openIndex === index ? '#C9A84C' : '#8A9BB5',
                  fontSize: '18px',
                  fontWeight: 300,
                  transition: 'all 0.3s ease',
                  transform: openIndex === index
                    ? 'rotate(45deg)'
                    : 'rotate(0deg)',
                }}>
                  +
                </span>
              </button>

              {/* Answer */}
              <div
                style={{
                  maxHeight: openIndex === index ? '300px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease',
                }}
              >
                <p style={{
                  padding: '0 24px 20px',
                  fontSize: '15px',
                  color: '#8A9BB5',
                  lineHeight: 1.8,
                  margin: 0,
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: '40px',
          padding: '28px',
          border: '1px solid rgba(201,168,76,0.2)',
          background: 'rgba(201,168,76,0.04)',
          textAlign: 'center',
        }}>
          <p style={{ color: '#8A9BB5', fontSize: '14px', marginBottom: '16px' }}>
            Still have questions? Our team is ready to help.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:willistonboardofrealtors@gmail.com"
              style={{
                padding: '10px 24px',
                background: '#C9A84C',
                color: '#04091A',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              ✉️ Email Us
            </a>
            <a
              href="https://t.me/willistonboardofrealtors"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 24px',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#C9A84C',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              ✈️ Telegram
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
