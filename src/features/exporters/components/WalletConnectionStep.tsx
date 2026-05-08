import FormInput from '../../../shared/components/form/FormInput'
import SelectInput from '../../../shared/components/form/SelectInput'
import { CheckCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '../../../shared/components/icons'
import Spinner from '../../../shared/components/ui/Spinner'
import { NETWORKS } from '../../../shared/data/networksConfig'

const networkOptions = NETWORKS.map(n => ({ value: n.id, label: `${n.label} (${n.symbol})` }))

interface WalletFormData {
  network: string
  walletAddress: string
}

interface WalletConnectionStepProps {
  formData: WalletFormData
  errors: { network?: string; walletAddress?: string; walletConnect?: string }
  onChange: (name: string, value: string) => void
  walletConnected: boolean
  isConnecting: boolean
  onConnectWallet: () => void
}

export default function WalletConnectionStep({
  formData, errors, onChange,
  walletConnected, isConnecting, onConnectWallet,
}: WalletConnectionStepProps) {
  const connectedNetwork = networkOptions.find(n => n.value === formData.network)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-ink">Wallet Connection</h3>
        <p className="text-sm text-ink-muted mt-1">
          Link your company wallet to receive cross-border payments securely on-chain.
        </p>
      </div>

      {/* Explainer */}
      <div className="flex gap-3 bg-brand-subtle/50 border border-brand/20 rounded-xl p-4">
        <InformationCircleIcon className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-ink mb-1">What is a wallet address?</p>
          <p className="text-sm text-ink-muted">
            A wallet address is a unique identifier for your digital payment account — similar to a bank account number. Payments processed through SRC Ecosystem will be sent directly to this address.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput
          label="Blockchain Network"
          name="network"
          value={formData.network}
          onChange={onChange}
          error={errors.network}
          placeholder="Select network"
          options={networkOptions}
          helper="Choose the network your wallet operates on"
          tooltip="The blockchain your wallet operates on. Must match your wallet app's network setting exactly — sending to the wrong network may result in unrecoverable funds."
          required
        />
        <FormInput
          label="Wallet Address"
          name="walletAddress"
          value={formData.walletAddress}
          onChange={onChange}
          error={errors.walletAddress}
          placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
          helper="Enter your full public wallet address"
          tooltip="Your public wallet address — safe to share, like a bank account number. Never share your private key or seed phrase with anyone."
          required
        />
      </div>

      {/* Connect / Connected state */}
      {walletConnected ? (
        <div className="flex items-center gap-3 bg-success-subtle border border-success-border rounded-xl p-4">
          <div className="w-9 h-9 rounded-full bg-success-accent/10 flex items-center justify-center shrink-0">
            <CheckCircleIcon className="w-5 h-5 text-success-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-success">Wallet Connected</p>
            <p className="text-xs text-ink-muted mt-0.5 truncate">
              {formData.walletAddress.slice(0, 12)}···{formData.walletAddress.slice(-8)}{' '}
              on {connectedNetwork?.label}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={onConnectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-6 py-2.5 border-2 border-brand text-brand hover:bg-brand hover:text-white rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConnecting ? <><Spinner /> Connecting wallet…</> : 'Connect Wallet'}
          </button>
          {errors.walletConnect && (
            <p className="text-xs text-danger flex items-center gap-1">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
              {errors.walletConnect}
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-ink-muted bg-surface rounded-lg px-4 py-3 leading-relaxed">
        🔒 <span className="font-medium text-ink-2">Security note:</span> Make sure this wallet belongs to your company. All incoming payments will be sent to this address. SRC Ecosystem will never ask for your private key or seed phrase.
      </p>
    </div>
  )
}
